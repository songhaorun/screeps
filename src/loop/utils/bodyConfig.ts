import { Role } from "@/role/base/Role";

export type BodyParts = Partial<Record<BodyPartConstant, number>>;

export interface ScalableBody {
    type: 'scale';
    base: BodyParts;
    scale: BodyParts;  // 每次缩放增加的部件
    maxScale?: number; // 最大缩放次数
}

export interface StagedBody {
    type: 'staged';
    stages: { minEnergy: number; body: BodyParts }[]; // 按能量阶段的固定配置
}

export interface LeveledBody {
    type: 'leveled';
    levels: Record<number, ScalableBody | StagedBody>; // 每个等级有独立的配置
}

export type BodyConfig = ScalableBody | StagedBody | LeveledBody;

export const BodyConfigs: Record<Role, BodyConfig> = {
    // Harvester: 分等级，不同等级工作方式不同
    [Role.Harvester]: {
        type: 'leveled',
        levels: {
            // 等级1: 采集+运输一体，等比缩放
            1: {
                type: 'scale',
                base: { [WORK]: 1, [CARRY]: 1, [MOVE]: 2 },
                scale: { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
                maxScale: 4,
            },
            // 等级2: 定点采集，按阶段配置
            2: {
                type: 'staged',
                stages: [
                    { minEnergy: 300, body: { [WORK]: 2, [CARRY]: 0, [MOVE]: 1 } },
                    { minEnergy: 550, body: { [WORK]: 5, [CARRY]: 0, [MOVE]: 1 } },
                    { minEnergy: 800, body: { [WORK]: 6, [CARRY]: 0, [MOVE]: 3 } },
                ],
            },
            // 等级3: 定点采集，按阶段配置
            3: {
                type: 'staged',
                stages: [
                    { minEnergy: 300, body: { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 } },
                    { minEnergy: 550, body: { [WORK]: 5, [CARRY]: 1, [MOVE]: 1 } },
                    { minEnergy: 800, body: { [WORK]: 6, [CARRY]: 1, [MOVE]: 3 } },
                ],
            },
        },
    },
    // Carrier: 等比缩放
    [Role.Carrier]: {
        type: 'scale',
        base: { [CARRY]: 2, [MOVE]: 1 },
        scale: { [CARRY]: 2, [MOVE]: 1 },
        maxScale: 8,
    },
    // Upgrader: 分等级
    [Role.Upgrader]: {
        type: 'leveled',
        levels: {
            // 等级1: 普通升级，需要自己取能量
            1: {
                type: 'scale',
                base: { [WORK]: 1, [CARRY]: 1, [MOVE]: 2 },
                scale: { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
                maxScale: 6,
            },
            // 等级2: 定点升级，从container或link取能量
            2: {
                type: 'scale',
                base: { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
                scale: { [WORK]: 2, [MOVE]: 1 },
                maxScale: 8,
            },
        },
    },
    // Builder: 等比缩放
    [Role.Builder]: {
        type: 'scale',
        base: { [WORK]: 1, [CARRY]: 2, [MOVE]: 2 },
        scale: { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
        maxScale: 6,
    },
    // Repairer: 按阶段
    [Role.Repairer]: {
        type: 'staged',
        stages: [
            { minEnergy: 300, body: { [WORK]: 1, [CARRY]: 2, [MOVE]: 2 } },
            { minEnergy: 550, body: { [WORK]: 2, [CARRY]: 3, [MOVE]: 3 } },
        ],
    },
};

function calcBodyCost(parts: BodyParts): number {
    let cost = 0;
    for (const part in parts) {
        cost += BODYPART_COST[part as BodyPartConstant] * (parts[part as BodyPartConstant] || 0);
    }
    return cost;
}

function partsToArray(parts: BodyParts): BodyPartConstant[] {
    const body: BodyPartConstant[] = [];
    for (const part in parts) {
        const count = parts[part as BodyPartConstant];
        if (count) body.push(...new Array(count).fill(part as BodyPartConstant));
    }
    return body;
}

function mergeParts(a: BodyParts, b: BodyParts): BodyParts {
    const result: BodyParts = { ...a };
    for (const part in b) {
        const p = part as BodyPartConstant;
        result[p] = (result[p] || 0) + (b[p] || 0);
    }
    return result;
}

function buildFromConfig(config: ScalableBody | StagedBody, energyCapacity: number): BodyPartConstant[] {
    if (config.type === 'staged') {
        let best = config.stages[0].body;
        for (const stage of config.stages) {
            if (energyCapacity >= stage.minEnergy) best = stage.body;
        }
        return partsToArray(best);
    } else {
        let parts = { ...config.base };
        let scaleCount = 0;
        const maxScale = config.maxScale ?? Infinity;

        while (scaleCount < maxScale) {
            const next = mergeParts(parts, config.scale);
            if (calcBodyCost(next) > energyCapacity) break;
            parts = next;
            scaleCount++;
        }
        return partsToArray(parts);
    }
}

export function getBody(role: Role, energyCapacity: number, level: number = 1): BodyPartConstant[] {
    const config = BodyConfigs[role];

    if (config.type === 'leveled') {
        // 找到对应等级的配置，如果没有则用最高可用等级
        const levels = Object.keys(config.levels).map(Number).sort((a, b) => a - b);
        let targetLevel = levels[0];
        for (const lv of levels) {
            if (lv <= level) targetLevel = lv;
        }
        return buildFromConfig(config.levels[targetLevel], energyCapacity);
    } else {
        return buildFromConfig(config, energyCapacity);
    }
}
