let getenergy = require('tools_getEnergy')
let roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getUsedCapacity()>0) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length == 0){
                for(const i in creep.room.memory.needEnergyIds){
                    const tneedEnergy=Game.getObjectById(creep.room.memory.needEnergyIds[i]);
                    if(tneedEnergy.store.getFreeCapacity(RESOURCE_ENERGY)>0)
                        targets.push(tneedEnergy);
                }
            }
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            getenergy(creep);
        }
    }
};

module.exports = roleCarrier;