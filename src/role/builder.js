let getenergy = require('tools_getEnergy');
let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	        creep.say('🚧 work');
	    }

	    if(creep.memory.working) {
			//work
			let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
				const target=creep.pos.findClosestByRange(targets);
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
			getenergy(creep,1000);
	    }
	}
};

module.exports = roleBuilder;