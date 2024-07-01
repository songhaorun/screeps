let getenergy = require('tools_getEnergy')
let getNearest = require('tools_getNearest')
let roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.store.getUsedCapacity() > 0) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	        //work
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length == 0){

                let towers=creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                let upgradeContainer=Game.getObjectById(creep.room.memory.upgradeContainerId);

                if(creep.memory.priorityTarget == 'tower'){
                    targets = towers;
                    if(targets.length == 0 && upgradeContainer.store.getFreeCapacity(RESOURCE_ENERGY)>0)
                        targets.push(upgradeContainer);
                }
                else if(creep.memory.priorityTarget == 'upgradeContainer'){
                    if(upgradeContainer.store.getFreeCapacity(RESOURCE_ENERGY)>0)
                        targets.push(upgradeContainer);
                    else
                        targets=towers;
                }
            }
            if(targets.length == 0){
                for(const i in creep.room.memory.needEnergyIds){
                    const tneedEnergy=Game.getObjectById(creep.room.memory.needEnergyIds[i]);
                    if(tneedEnergy.store.getFreeCapacity(RESOURCE_ENERGY)>0)
                        targets.push(tneedEnergy);
                }
            }
            if(targets.length > 0) {
                const target = getNearest(creep.pos,targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
            getenergy(creep);
	    }
    }
};

module.exports = roleCarrier;