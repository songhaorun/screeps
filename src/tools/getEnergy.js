/**
 * 
 * @param {Creep} creep 
 * @param {number} energyFloor 容器能量下限
 * @returns 
 */
function getEnergy(creep,energyFloor=0){
    //有预设能量源优先使用
    let source;
    if(creep.memory.sourceid){
        let provideEnergy=Game.getObjectById(creep.memory.sourceid);
        if(provideEnergy.store.getUsedCapacity(RESOURCE_ENERGY) > energyFloor)
            source=provideEnergy;
    }
    //无预设能量源使用最近能量源
    if(!source){
        let provideEnergys=[];
        for(const i in creep.room.memory.provideEnergyIds){
            let tprovideEnergy=Game.getObjectById(creep.room.memory.provideEnergyIds[i]);
            if(tprovideEnergy.store.getUsedCapacity(RESOURCE_ENERGY) > energyFloor)
                provideEnergys.push(tprovideEnergy);
        }
        source = creep.pos.findClosestByPath(provideEnergys);
    }
    if(!source){
        return -100;
    }
    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        return creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    return 0;
}

module.exports = getEnergy;