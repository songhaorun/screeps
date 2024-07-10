let roleMineralCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
		const mineral=Game.getObjectById(creep.memory.mineralId);
        const container=Game.getObjectById(creep.memory.containerId);
        if(creep.memory.working && creep.store[mineral.mineralType] == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.store.getUsedCapacity() > 0) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	        //work
            if(creep.transfer(creep.room.storage, mineral.mineralType) == ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
	    }
	    else{
            if(creep.withdraw(container,mineral.mineralType) == ERR_NOT_IN_RANGE)
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
	    }
    }
};

module.exports = roleMineralCarrier;