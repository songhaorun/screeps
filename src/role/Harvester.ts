import { when, branch, IRole, RoleBase } from './base/RoleBase';

declare global {
    interface CreepMemory {
        sourceId?: Id<Source>;
        containerId?: Id<StructureContainer>;
        linkId?: Id<StructureLink>;
    }
}

function findSource(creep: Creep): Source | null {
    return (creep.memory.sourceId && Game.getObjectById(creep.memory.sourceId)) || creep.room.find(FIND_SOURCES).filter(s => s.energy > 0)[0] || null;
}

function findContainerSite(creep: Creep): ConstructionSite<STRUCTURE_CONTAINER> | null {
    const source = findSource(creep);
    if (!source) return null;
    const sites = source.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
        filter: (s) => s.structureType === STRUCTURE_CONTAINER,
    }) as ConstructionSite<STRUCTURE_CONTAINER>[];
    return sites[0] || null;
}

function findContainer(creep: Creep): StructureContainer | null {
    if (creep.memory.containerId) {
        const container = Game.getObjectById(creep.memory.containerId);
        if (container) return container;
    }
    const source = findSource(creep);
    if (!source) return null;
    const containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER,
    }) as StructureContainer[];
    return containers[0] || null;
}

function findSpawnOrExtension(creep: Creep): StructureSpawn | StructureExtension | null {
    return creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
            (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) &&
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    }) as StructureSpawn | StructureExtension | null;
}

// ===== 等级1: 无container，采集->存储->建造->升级 =====
const enum Harvester1State {
    HARVEST = 0,
    STORE = 1,
    BUILD = 2,
    UPGRADE = 3,
}

class RoleHarvester1Impl extends RoleBase {
    protected readonly initialState = Harvester1State.HARVEST;

    protected readonly states = {
        [Harvester1State.HARVEST]: {
            onEnter: (creep: Creep) => creep.say('HARVEST'),
            onExecute: (creep: Creep) => {
                const source = findSource(creep);
                if (source) {
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
                else {
                    console.log(`Harvester ${creep.name} cannot find source!`);
                }
            },
            transitions: [
                // 能量满了，优先去存储spawn/extension, 没有的话就建造container, 没有工地了就去升级
                when(
                    (creep) => creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0,
                    branch(
                        when((creep) => !!findSpawnOrExtension(creep), Harvester1State.STORE),
                        when((creep) => !!findContainerSite(creep), Harvester1State.BUILD),
                        Harvester1State.UPGRADE
                    )
                )
            ],
        },
        [Harvester1State.STORE]: {
            onEnter: (creep: Creep) => creep.say('STORE'),
            onExecute: (creep: Creep) => {
                const target = findSpawnOrExtension(creep);
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            },
            transitions: [
                // 能量用完了，回去采集
                when(
                    (creep) => creep.store[RESOURCE_ENERGY] === 0,
                    Harvester1State.HARVEST
                ),
                // 目标满了，回去采集或建造
                when(
                    (creep) => !findSpawnOrExtension(creep),
                    branch(
                        when((creep) => !!findContainerSite(creep), Harvester1State.BUILD),
                        when((creep) => creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0, Harvester1State.HARVEST),
                        Harvester1State.UPGRADE
                    )
                )
            ],
        },
        [Harvester1State.BUILD]: {
            onEnter: (creep: Creep) => creep.say('BUILD'),
            onExecute: (creep: Creep) => {
                const site = findContainerSite(creep);
                if (site) {
                    if (creep.build(site) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(site, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            },
            transitions: [
                // spawn/extension有空位了，去存储
                when(
                    (creep) => !!findSpawnOrExtension(creep),
                    Harvester1State.STORE
                ),
                // 能量用完了，回去采集
                when(
                    (creep) => creep.store[RESOURCE_ENERGY] === 0,
                    Harvester1State.HARVEST
                ),
                // 工地建完了，回去采集
                when(
                    (creep) => !findContainerSite(creep),
                    branch(
                        when((creep) => creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0, Harvester1State.HARVEST),
                        Harvester1State.UPGRADE
                    ),
                ),
            ],
        },
        [Harvester1State.UPGRADE]: {
            onEnter: (creep: Creep) => creep.say('UPGRADE'),
            onExecute: (creep: Creep) => {
                if (creep.upgradeController(creep.room.controller!) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller!, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            },
            transitions: [
                // 能量用完了，回去采集
                when(
                    (creep) => creep.store[RESOURCE_ENERGY] === 0,
                    Harvester1State.HARVEST
                ),
                // spawn/extension有空位了，去存储
                when(
                    (creep) => !!findSpawnOrExtension(creep),
                    Harvester1State.STORE
                ),
            ],
        },
    };
}

// ===== 等级2: 有container，站在container上采集 =====
const enum Harvester2State {
    MOVING = 0,
    HARVESTING = 1,
}

class RoleHarvester2Impl extends RoleBase<Harvester2State> {
    protected readonly initialState = Harvester2State.MOVING;

    protected readonly states = {
        [Harvester2State.MOVING]: {
            onExecute: (creep: Creep) => {
                const container = findContainer(creep);
                if (container) {
                    creep.moveTo(container.pos, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            },
            transitions: [
                when((creep) => {
                    const container = findContainer(creep);
                    return container ? creep.pos.isEqualTo(container.pos) : false;
                }, Harvester2State.HARVESTING),
            ],
        },
        [Harvester2State.HARVESTING]: {
            onExecute: (creep: Creep) => {
                const source = findSource(creep);
                const container = findContainer(creep);
                if (source && container && (container.store.getFreeCapacity(RESOURCE_ENERGY) > 0 || creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)) {
                    creep.harvest(source);
                }
            },
        },
    };
}

// TODO: 等级3实现未检查
// ===== 等级3: 有link，采集并传输到link =====
const enum Harvester3State {
    MOVING = 0,
    HARVESTING = 1,
}

class RoleHarvester3Impl extends RoleBase<Harvester3State> {
    protected readonly initialState = Harvester3State.MOVING;

    protected readonly states = {
        [Harvester3State.MOVING]: {
            onExecute: (creep: Creep) => {
                const container = findContainer(creep);
                if (container) {
                    creep.moveTo(container.pos, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            },
            transitions: [
                when((creep) => {
                    const container = findContainer(creep);
                    return container ? creep.pos.isEqualTo(container.pos) : false;
                }, Harvester3State.HARVESTING),
            ],
        },
        [Harvester3State.HARVESTING]: {
            onEnter: (creep: Creep) => creep.say('⛏️'),
            onExecute: (creep: Creep) => {
                const source = Game.getObjectById(creep.memory.sourceId!);
                const container = findContainer(creep);
                const link = Game.getObjectById(creep.memory.linkId!);

                // 优先传输到link
                if (link && link.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && container) {
                        creep.withdraw(container, RESOURCE_ENERGY);
                    }
                    creep.transfer(link, RESOURCE_ENERGY);
                }
                // 采集
                if (source && container && (container.store.getFreeCapacity(RESOURCE_ENERGY) > 0 || creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)) {
                    creep.harvest(source);
                }
            },
            transitions: [
                when((creep) => {
                    const container = findContainer(creep);
                    return container ? !creep.pos.isEqualTo(container.pos) : false;
                }, Harvester3State.MOVING),
            ],
        },
    };
}

export const RoleHarvester1 = new RoleHarvester1Impl();
export const RoleHarvester2 = new RoleHarvester2Impl();
export const RoleHarvester3 = new RoleHarvester3Impl();

class LevelledHarvester implements IRole {
    private readonly roles: Record<number, RoleBase<any>>;

    constructor(roles: Record<number, RoleBase<any>>) {
        this.roles = roles;
    }

    run(creep: Creep): void {
        const level = creep.memory.level || 1;
        const role = this.roles[level] || this.roles[1];
        if (role) {
            role.run(creep);
        }
    }
}

export const RoleHarvester = new LevelledHarvester({
    1: RoleHarvester1,
    2: RoleHarvester2,
    3: RoleHarvester3,
});
