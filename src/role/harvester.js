let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const container=Game.getObjectById(creep.memory.containerid);
        if(creep.pos.x === container.pos.x && creep.pos.y === container.pos.y && creep.pos.roomName === container.pos.roomName) {
            creep.memory.working = true;
        }
	    else{
	        creep.memory.working = false;
	    }

	    if(creep.memory.working) {
	        //work
            if(container.store.getFreeCapacity()>0){
                creep.harvest(Game.getObjectById(creep.memory.sourceid));
            }
	    }
	    else {
			creep.moveTo(container.pos,{visualizePathStyle: {stroke: '#ffaa00'}});
	    }
	}
};

module.exports = roleHarvester;