let roleMineralCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
		const mineral=Game.getObjectById(creep.memory.mineralId);
        const container=Game.getObjectById(creep.memory.containerId);
        const storage=creep.room.storage;
        const terminal=creep.room.terminal;
        if(creep.memory.working && creep.store[mineral.mineralType] == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.store.getUsedCapacity() > 0) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	        //work
            const target=storage.store.getUsedCapacity(mineral.mineralType) >= 100000?terminal:storage;
            if(creep.transfer(target, mineral.mineralType) == ERR_NOT_IN_RANGE)
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
	    }
	    else{
            if(creep.withdraw(container,mineral.mineralType) == ERR_NOT_IN_RANGE)
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
	    }
    }
};

module.exports = roleMineralCarrier;