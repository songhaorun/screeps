type EnergySource = StructureStorage | StructureContainer | StructureLink | Source;

export function getEnergy(creep: Creep, source?: EnergySource): ScreepsReturnCode | ERR_NO_SOURCE {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        return OK; // 已经满了，不需要再获取
    }

    source ??= findEnergySource(creep);
    if (!source) {
        return ERR_NO_SOURCE;
    }

    const result = source instanceof Source
        ? creep.harvest(source)
        : creep.withdraw(source, RESOURCE_ENERGY);

    if (result === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        return OK; // 正在移动中，不算错误
    }

    return result;
}

function findEnergySource(creep: Creep): EnergySource | undefined {
    const room = creep.room;

    // 1. 优先 Storage
    if (room.storage) {
        return room.storage;
    }

    // 2. sourceContainers - 按距离和剩余能量加权
    const containerIds = room.memory.containerIds?.sourceContainers;
    if (containerIds && containerIds.length > 0) {
        const containers = containerIds
            .map(id => Game.getObjectById(id))
            .filter((c): c is StructureContainer => c !== null && c.store.getUsedCapacity(RESOURCE_ENERGY) > 0);

        if (containers.length > 0) {
            const bestContainer = containers.reduce((best, current) => {
                const bestScore = calcContainerScore(creep, best);
                const currentScore = calcContainerScore(creep, current);
                return currentScore > bestScore ? current : best;
            });
            return bestContainer;
        }
    }

    // 3. Source - 按距离、剩余能量、恢复时间加权
    const sources = room.find(FIND_SOURCES);
    if (sources.length > 0) {
        const bestSource = sources.reduce((best, current) => {
            const bestScore = calcSourceScore(creep, best);
            const currentScore = calcSourceScore(creep, current);
            return currentScore > bestScore ? current : best;
        });
        if (bestSource.energy > 0 || bestSource.ticksToRegeneration < 50) {
            return bestSource;
        }
    }

    return undefined;
}

function calcContainerScore(creep: Creep, container: StructureContainer): number {
    const distance = creep.pos.getRangeTo(container);
    const energy = container.store.getUsedCapacity(RESOURCE_ENERGY);
    const capacity = container.store.getCapacity(RESOURCE_ENERGY);
    const freeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);
    // 实际能拿到的能量
    const effectiveEnergy = Math.min(energy, freeCapacity);
    // 填充率越高权重越大，快满时优先取走防止溢出
    const fillRatio = energy / capacity;
    const fullnessBonus = fillRatio > 0.8 ? 1 + (fillRatio - 0.8) * 5 : 1; // 80%以上开始加成，满时最高2倍
    // 距离越近分数越高，能拿到的能量越多分数越高
    return (effectiveEnergy / (distance + 1)) * fullnessBonus;
}

function calcSourceScore(creep: Creep, source: Source): number {
    const distance = creep.pos.getRangeTo(source);
    const energy = source.energy;
    const ticksToRegen = source.ticksToRegeneration || 300;
    const freeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);
    // 距离越近、能拿到的能量越多、恢复时间越短，分数越高
    if (energy > 0) {
        const effectiveEnergy = Math.min(energy, freeCapacity);
        return effectiveEnergy / (distance + 1);
    } else {
        // 能量为0时，用恢复时间的倒数作为权重
        return freeCapacity / ((distance + 1) * ticksToRegen);
    }
}
