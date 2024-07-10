let getenergy = require('tools_getEnergy');
let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
			//work
			const target=creep.pos.findClosestByRange(global.myConstructionSite[creep.room.name]);
			if(creep.build(target) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
			}
	    }
	    else {
			getenergy(creep,5000);
	    }
	}
};

module.exports = roleBuilder;