import { Role } from '@/role/Role';
import { IRole } from '@/role/RoleBase';
import { RoleHarvester } from '@/role/Harvester';
import { RoleUpgrader } from '@/role/Upgrader';
import { RoleBuilder } from '@/role/Builder';
import { RoleRepairer } from '@/role/Repairer';

// 角色实例映射
const roleHandlers: Partial<Record<Role, IRole>> = {
    [Role.Harvester]: RoleHarvester,
    [Role.Upgrader]: RoleUpgrader,
    [Role.Builder]: RoleBuilder,
    [Role.Repairer]: RoleRepairer
};

export function creeps() {
    for (const creep of Object.values(Game.creeps)) {
        if (creep.spawning) continue; // 跳过正在生成中的 creep
        const role = roleHandlers[creep.memory.role];

        if (role) {
            role.run(creep);
        } else {
            console.log(`Error: ${creep.name} has uninterfaced role: ${creep.memory.role}`);
        }
    }
}
