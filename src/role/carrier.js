let getenergy = require('tools_getEnergy')
let roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.store.getUsedCapacity() > 0) {
	        creep.memory.working = true;
	    }

        let extensions = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        let towers=creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 250;
            }
        });
        let targets = extensions.length!=0 ? extensions : towers;

	    if(creep.memory.working) {
	        //work
            if(targets.length == 0){
                for(const i in creep.room.memory.needEnergyIds){
                    const tneedEnergy=Game.getObjectById(creep.room.memory.needEnergyIds[i]);
                    if(tneedEnergy.store.getFreeCapacity(RESOURCE_ENERGY)>0)
                        targets.push(tneedEnergy);
                }
            }
            if(targets.length > 0) {
                const target = creep.pos.findClosestByPath(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                creep.memory.working = false
            }
	    }
	    if(!creep.memory.working) {
            if(targets.length > 0)
                getenergy(creep,0,creep.room.storage.store.getUsedCapacity()>0 ? creep.room.storage : undefined);
            else
                getenergy(creep);
	    }
    }
};

module.exports = roleCarrier;