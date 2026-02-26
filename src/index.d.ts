interface CreepMemory {
    /** 职业 */
    role: import('@/role/Role').Role;
    /** 工作等级 */
    level?: number;
    /** 状态机当前状态 */
    state: number
    /** 是否重生 */
    respawn: boolean
    /** 出生房间名 */
    roomName: string
}

interface RoomMemory {
    linkIds?: {
        upgradeLink?: Id<StructureLink>
        sourceLinks?: Id<StructureLink>[]
    }
    containerIds?: {
        upgradeContainer?: Id<StructureContainer>
        sourceContainers?: Id<StructureContainer>[]
    }
}

declare const ERR_NO_SOURCE: ERR_NO_SOURCE;
type ERR_NO_SOURCE = -100

