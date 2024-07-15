let getenergy = require('tools_getEnergy')
let roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
	        creep.memory.working = true;
	    }

        const extensions = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        const towers=creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 250;
            }
        });
        const storage=creep.room.storage;
        const terminal=creep.room.terminal;
        const targets = extensions.length!=0 ? extensions : towers;
        let target;

	    if(creep.memory.working) {
	        //work
            if(targets.length > 0)
                target = creep.pos.findClosestByPath(targets);
            else if(storage.store.getUsedCapacity(RESOURCE_ENERGY) < 100000)
                target = storage;
            else if(terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 10000)
                target = terminal;
            else
                target = storage;
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    if(!creep.memory.working) {
            if(targets.length > 0)
                getenergy(creep,0,creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY)>0 ? creep.room.storage : undefined);
            else
                getenergy(creep);
	    }
    }
};

module.exports = roleCarrier;