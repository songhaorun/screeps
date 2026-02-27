let roleMineralHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
		const mineral=Game.getObjectById(creep.memory.mineralId);
        const container=Game.getObjectById(creep.memory.containerId);
        if(creep.pos.isEqualTo(container.pos)) {
            creep.memory.working = true;
        }
	    else{
	        creep.memory.working = false;
	    }

	    if(creep.memory.working) {
	        //work
            if(container.store.getFreeCapacity()>0){
                creep.harvest(mineral);
            }
	    }
	    else {
			creep.moveTo(container.pos,{visualizePathStyle: {stroke: '#ffaa00'}});
	    }
	}
};

module.exports = roleMineralHarvester;