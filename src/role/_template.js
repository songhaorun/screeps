let getenergy = require('tools_getEnergy')
let role = {

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
	    }
	    else {
			getenergy(creep);
	    }
	}
};

module.exports = role;