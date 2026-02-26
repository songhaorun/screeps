/**
 * 自动更新房间 Memory 中的结构 ID
 * @param roomName 房间名
 */
export function updateRoomId(roomName: string): void {
    const room = Game.rooms[roomName];
    if (!room) {
        console.log(`Error: Room ${roomName} not visible`);
        return;
    }

    const sources = room.find(FIND_SOURCES);
    const controller = room.controller;

    // 查找 source 旁的 container 和 link
    const sourceContainers: Id<StructureContainer>[] = [];
    const sourceLinks: Id<StructureLink>[] = [];

    for (const source of sources) {
        const container = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (s) => s.structureType === STRUCTURE_CONTAINER,
        })[0] as StructureContainer | undefined;
        if (container) {
            sourceContainers.push(container.id);
        }

        const link = source.pos.findInRange(FIND_STRUCTURES, 2, {
            filter: (s) => s.structureType === STRUCTURE_LINK,
        })[0] as StructureLink | undefined;
        if (link) {
            sourceLinks.push(link.id);
        }
    }

    // 查找 controller 旁的 container 和 link
    let upgradeContainer: Id<StructureContainer> | undefined;
    let upgradeLink: Id<StructureLink> | undefined;

    if (controller) {
        const container = controller.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: (s) => s.structureType === STRUCTURE_CONTAINER,
        })[0] as StructureContainer | undefined;
        if (container) {
            upgradeContainer = container.id;
        }

        const link = controller.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: (s) => s.structureType === STRUCTURE_LINK,
        })[0] as StructureLink | undefined;
        if (link) {
            upgradeLink = link.id;
        }
    }

    // 更新 Memory
    Memory.rooms[roomName] = {
        ...Memory.rooms[roomName],
        containerIds: {
            sourceContainers: sourceContainers.length > 0 ? sourceContainers : undefined,
            upgradeContainer,
        },
        linkIds: {
            sourceLinks: sourceLinks.length > 0 ? sourceLinks : undefined,
            upgradeLink,
        },
    };

    console.log(`Updated room ${roomName} IDs:`, JSON.stringify(Memory.rooms[roomName]));
}
