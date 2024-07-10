let roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let workPos;
        if(creep.memory.workPos)
            workPos = new RoomPosition(creep.memory.workPos.x,creep.memory.workPos.y,creep.memory.workPos.roomName);
        const link = Game.getObjectById(creep.room.memory.linkIds.upgradeLink);
        const container = Game.getObjectById(creep.room.memory.containerIds.upgradeContainer);
        const source = link || container;

        if(creep.pos.isEqualTo(workPos)) {
            creep.memory.working = true;
        }
	    else{
	        creep.memory.working = false;
	    }

	    if(creep.memory.working) {
            //work
            if(creep.store.getUsedCapacity() <= 50)
                creep.withdraw(source,RESOURCE_ENERGY);
            creep.upgradeController(creep.room.controller);
	    }
	    else {
            creep.moveTo(workPos,{visualizePathStyle: {stroke: '#ffaa00'}});
	    }
	}
}

module.exports = roleUpgrader;