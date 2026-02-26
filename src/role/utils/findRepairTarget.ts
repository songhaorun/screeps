declare global {
    interface CreepMemory {
        repairTargetId?: Id<Structure>;
    }
}

const REPAIR_THRESHOLD = 1.0; // 维修优先级阈值，建筑物血量比例低于该值时才维修

export function findRepairTarget(creep: Creep): Structure | null {
    if (creep.memory.repairTargetId) {
        const cached = Game.getObjectById(creep.memory.repairTargetId);
        if (cached && cached.hits < cached.hitsMax) {
            return cached;
        }
        delete creep.memory.repairTargetId;
    }

    // 优先寻找普通建筑物，血量低于阈值
    const normalTargets = creep.room.find(FIND_STRUCTURES, {
        filter: (s) =>
            s.structureType !== STRUCTURE_WALL &&
            s.structureType !== STRUCTURE_RAMPART &&
            s.hits < s.hitsMax * REPAIR_THRESHOLD,
    });

    if (normalTargets.length > 0) {
        normalTargets.sort((a, b) => {
            const aRatio = a.hits / a.hitsMax;
            const bRatio = b.hits / b.hitsMax;
            if (aRatio !== bRatio) return aRatio - bRatio;
            return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
        });
        const target = normalTargets[0];
        creep.memory.repairTargetId = target.id;
        return target;
    }

    // 没有普通建筑时，找 wall/rampart
    const wallTargets = creep.room.find(FIND_STRUCTURES, {
        filter: (s) =>
            (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) &&
            s.hits < s.hitsMax,
    });

    if (wallTargets.length === 0) return null;

    wallTargets.sort((a, b) => {
        if (a.hits !== b.hits) return a.hits - b.hits;
        return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
    });

    const target = wallTargets[0];
    creep.memory.repairTargetId = target.id;
    return target;
}
