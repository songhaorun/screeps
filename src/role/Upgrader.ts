import { RoleBase, when } from './RoleBase';
import { getEnergy } from './utils/getEnergy';

declare global {
    interface CreepMemory {
        containerId?: Id<StructureContainer>;
        linkId?: Id<StructureLink>;
    }
}
const enum UpgraderState {
    COLLECTING = 0,
    UPGRADING = 1,
}

/// 升级工 - 采集能量 → 升级
class RoleUpgraderImpl extends RoleBase<UpgraderState> {
    protected readonly initialState = UpgraderState.COLLECTING;

    protected readonly states = {
        [UpgraderState.COLLECTING]: {
            onEnter: (creep: Creep) => creep.say('🔄 COLLECTING'),
            onExecute: (creep: Creep) => {
                const result = getEnergy(creep,
                    (creep.memory.linkId && Game.getObjectById(creep.memory.linkId)) ||
                    (creep.memory.containerId && Game.getObjectById(creep.memory.containerId)) ||
                    undefined
                );
                if (result !== OK) {
                    console.log(`Error: ${creep.name} failed to get energy: ${result}`);
                }
            },
            transitions: [
                when((creep) => creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0, UpgraderState.UPGRADING),
            ],
        },

        [UpgraderState.UPGRADING]: {
            onEnter: (creep: Creep) => creep.say('⚡ UPGRADING'),
            onExecute: (creep: Creep) => {
                const controller = creep.room.controller;
                if (controller) {
                    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            },
            transitions: [
                when((creep) => creep.store[RESOURCE_ENERGY] === 0, UpgraderState.COLLECTING),
            ],
        },
    };
}

export const RoleUpgrader = new RoleUpgraderImpl();
