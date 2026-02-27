import { Role } from "@/role/base/Role";

const validRoles = Object.values(Role);

/**
 * 为房间内每个 source 添加一个 Harvester
 * @param roomName 房间名
 * @param level Harvester 等级，默认为 1
 * @returns 创建的 creep 名字数组
 */
export function addHarvesterBySource(roomName: string, level: number = 1): string[] {
    const room = Game.rooms[roomName];
    if (!room) {
        console.log(`Error: Room ${roomName} not visible`);
        return [];
    }

    const sources = room.find(FIND_SOURCES);
    const createdNames: string[] = [];

    for (const source of sources) {
        const creepName = addCreep(roomName, Role.Harvester, level, { sourceId: source.id });
        if (creepName) {
            createdNames.push(creepName);
        }
    }

    return createdNames;
}

/**
 * 添加一个 creep 到重生队列
 * @param roomName 房间名
 * @param role 职业
 * @param level 等级，默认为 1
 * @returns creep 名字，失败返回空字符串
 */
export function addCreep(roomName: string, role: Role, level: number = 1, memory?: Partial<CreepMemory>): string {
    // 校验房间名
    if (!Game.rooms[roomName]) {
        console.log(`Error: Room ${roomName} not visible`);
        return '';
    }

    // 校验职业
    if (!validRoles.includes(role)) {
        console.log(`Error: Invalid role ${role}`);
        return '';
    }

    // 找到该房间该职业的最大编号
    let maxNum = 0;
    const prefix = `${roomName}_${role}_`;
    for (const name in Memory.creeps) {
        if (name.startsWith(prefix)) {
            const num = parseInt(name.slice(prefix.length), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
        }
    }

    const creepName = `${prefix}${maxNum + 1}`;
    Memory.creeps[creepName] = {
        role,
        level,
        state: 0,
        respawn: true,
        roomName,
        ...memory,
    };

    console.log(`Added creep: ${creepName}`);
    return creepName;
}

type CreepQuery = string | [roomName: string, role: Role, id: number];

/**
 * 查找 creep 名字
 * @param query creep 名字，或 [roomName, role, id]
 */
function findCreepName(query: CreepQuery): string | null {
    if (typeof query === 'string') {
        return Memory.creeps[query] ? query : null;
    }
    const [roomName, role, id] = query;
    const name = `${roomName}_${role}_${id}`;
    return Memory.creeps[name] ? name : null;
}

/**
 * 设置 creep 的部分属性
 * @param query creep 名字，或 [roomName, role, id]
 * @param memory 要设置的属性
 */
export function setCreep(query: CreepQuery, memory: Partial<CreepMemory>): boolean {
    const name = findCreepName(query);
    if (!name) {
        console.log(`Error: Creep not found`);
        return false;
    }
    Memory.creeps[name] = { ...Memory.creeps[name], ...memory };
    console.log(`Updated creep ${name}:`, JSON.stringify(memory));
    return true;
}

/**
 * 删除 creep（如果还活着则设置 respawn 为 false，等死后自动清理 memory）
 * @param query creep 名字，或 [roomName, role, id]
 */
export function removeCreep(query: CreepQuery): boolean {
    const name = findCreepName(query);
    if (!name) {
        console.log(`Error: Creep not found`);
        return false;
    }

    if (Game.creeps[name]) {
        // creep 还活着，设置 respawn 为 false
        Memory.creeps[name].respawn = false;
        console.log(`Creep ${name} marked for removal (will not respawn)`);
    } else {
        // creep 已死，直接删除 memory
        delete Memory.creeps[name];
        console.log(`Deleted creep memory: ${name}`);
    }
    return true;
}

/**
 * 删除 creep 的 memory（仅限已死亡的 creep）
 * @param query creep 名字，或 [roomName, role, id]
 */
export function removeCreepMemory(query: CreepQuery): boolean {
    const name = findCreepName(query);
    if (!name) {
        console.log(`Error: Creep not found`);
        return false;
    }

    if (Game.creeps[name]) {
        console.log(`Error: Cannot delete memory of living creep ${name}`);
        return false;
    }

    delete Memory.creeps[name];
    console.log(`Deleted creep memory: ${name}`);
    return true;
}
