let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
		const source=Game.getObjectById(creep.memory.sourceId);
        const container=Game.getObjectById(creep.memory.containerId);
		const link=Game.getObjectById(creep.memory.linkId);
        if(creep.pos.isEqualTo(container.pos)) {
            creep.memory.working = true;
        }
	    else{
	        creep.memory.working = false;
	    }

	    if(creep.memory.working) {
	        //work
			if(link && link.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
				if(creep.store.getFreeCapacity() > 0)
					creep.withdraw(container,RESOURCE_ENERGY);
				creep.transfer(link,RESOURCE_ENERGY);
			}
            if(container.store.getFreeCapacity()>0 || creep.store.getFreeCapacity() > 0){
                creep.harvest(source);
            }
	    }
	    else {
			creep.moveTo(container.pos,{visualizePathStyle: {stroke: '#ffaa00'}});
	    }
	}
};

module.exports = roleHarvester;