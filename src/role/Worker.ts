import { RoleBase, when, IRole } from './base/RoleBase';
import { getEnergy } from './utils/getEnergy';
import { findRepairTarget } from './utils/findRepairTarget';

const enum WorkerState {
    COLLECTING = 0,
    BUILDING = 1,
    REPAIRING = 2,
    UPGRADING = 3,
}

type Task = 'build' | 'repair' | 'upgrade';

interface WorkerConfig {
    /** 任务优先级，按顺序尝试 */
    tasks: Task[];
}

class WorkerImpl extends RoleBase<WorkerState> {
    protected readonly initialState = WorkerState.COLLECTING;
    private config: WorkerConfig;

    constructor(config: WorkerConfig) {
        super();
        this.config = config;
    }

    protected readonly states = {
        [WorkerState.COLLECTING]: {
            onEnter: (creep: Creep) => {
                creep.say('🔄 COLLECT');
            },
            onExecute: (creep: Creep) => {
                const result = getEnergy(creep);
                if (result !== OK) {
                    console.log(`Error: ${creep.name} failed to get energy: ${result}`);
                }
            },
            transitions: [
                when(
                    (creep) => creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0,
                    (creep) => this.getNextTaskState(creep)
                ),
            ],
        },

        [WorkerState.BUILDING]: {
            onEnter: (creep: Creep) => creep.say('🚧 BUILD'),
            onExecute: (creep: Creep) => {
                const target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
                if (target) {
                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            },
            transitions: [
                when((creep) => creep.store[RESOURCE_ENERGY] === 0, WorkerState.COLLECTING),
                when((creep) => !this.hasConstructionSites(creep), (creep) => this.getNextTaskState(creep)),
            ],
        },

        [WorkerState.REPAIRING]: {
            onEnter: (creep: Creep) => creep.say('🔧 REPAIR'),
            onExecute: (creep: Creep) => {
                const target = findRepairTarget(creep);
                if (target) {
                    if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            },
            transitions: [
                when((creep) => creep.store[RESOURCE_ENERGY] === 0, WorkerState.COLLECTING),
                when((creep) => !findRepairTarget(creep), (creep) => this.getNextTaskState(creep)),
            ],
        },

        [WorkerState.UPGRADING]: {
            onEnter: (creep: Creep) => creep.say('⚡ UPGRADE'),
            onExecute: (creep: Creep) => {
                if (creep.room.controller) {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            },
            transitions: [
                when((creep) => creep.store[RESOURCE_ENERGY] === 0, WorkerState.COLLECTING),
            ],
        },
    };

    private hasConstructionSites(creep: Creep): boolean {
        return creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0;
    }

    private canDoTask(creep: Creep, task: Task): boolean {
        switch (task) {
            case 'build': return this.hasConstructionSites(creep);
            case 'repair': return !!findRepairTarget(creep);
            case 'upgrade': return !!creep.room.controller;
        }
    }

    private taskToState(task: Task): WorkerState {
        switch (task) {
            case 'build': return WorkerState.BUILDING;
            case 'repair': return WorkerState.REPAIRING;
            case 'upgrade': return WorkerState.UPGRADING;
        }
    }

    private getNextTaskState(creep: Creep): WorkerState {
        for (const task of this.config.tasks) {
            if (this.canDoTask(creep, task)) {
                return this.taskToState(task);
            }
        }
        // 没有可做的任务，回去采集
        return WorkerState.COLLECTING;
    }
}

// Builder: 建造优先
export const RoleBuilder: IRole = new WorkerImpl({ tasks: ['build', 'repair', 'upgrade'] });

// Repairer: 修理优先
export const RoleRepairer: IRole = new WorkerImpl({ tasks: ['repair', 'build', 'upgrade'] });
