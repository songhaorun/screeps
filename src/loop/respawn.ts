import { Role } from "@/role/base/Role";
import { getBody } from "./utils/bodyConfig";

function getRespawnList(): Record<string, string[]> {
    const respawnList: Record<string, string[]> = {};
    for (const creepName in Memory.creeps) {
        // 已经存在的 creep 或者不需要重生的 creep 不加入重生列表
        if (Game.creeps[creepName] || !Memory.creeps[creepName].respawn) continue;
        const { roomName, role } = Memory.creeps[creepName];
        if (!respawnList[roomName]) respawnList[roomName] = [];

        // carrier 和 harvester 优先生成
        if (role === Role.Carrier || role === Role.Harvester)
            respawnList[roomName].unshift(creepName);
        else
            respawnList[roomName].push(creepName);
        Memory.creeps[creepName].state = 0;
    }
    return respawnList;
}

export function respawn() {
    const respawnList = getRespawnList();

    for (const spawn of Object.values(Game.spawns)) {
        if (spawn.spawning) {
            spawn.room.visual.text(
                '🛠️' + spawn.spawning.name,
                spawn.pos.x + 1,
                spawn.pos.y,
                { align: 'left', opacity: 0.8 });
        } else if (respawnList[spawn.room.name]?.length > 0) {
            const creepName = respawnList[spawn.room.name][0];
            const creepMemory = Memory.creeps[creepName];
            const role = creepMemory.role;
            const level = creepMemory.level ?? 1;
            const result = spawn.spawnCreep(getBody(role, spawn.room.energyCapacityAvailable, level), creepName);
            if (result === OK) {
                respawnList[spawn.room.name].shift();
            } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
                console.log(`${spawn.name} spawn ${creepName} failed: ${result}`);
            }
        }
    }
}
