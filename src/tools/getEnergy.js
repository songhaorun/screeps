let getNearest = require('tools_getNearest');
/** @param {Creep} creep **/
function getenergy(creep){
    //有预设能量源优先使用
    let source;
    if(creep.memory.sourceid){
        let provideEnergy=Game.getObjectById(creep.memory.sourceid);
        if(provideEnergy.store.getUsedCapacity() > 0)
            source=provideEnergy;
    }
    //无预设能量源使用最近能量源
    if(!source){
        let provideEnergys=[];
        for(const i in creep.room.memory.provideEnergyIds){
            let tprovideEnergy=Game.getObjectById(creep.room.memory.provideEnergyIds[i]);
            if(tprovideEnergy.store.getUsedCapacity()>0)
                provideEnergys.push(tprovideEnergy);
        }
        source = getNearest(creep.pos,provideEnergys);
    }
    if(!source){
        console.log("ERROR:"+creep.name+"has no energe source!");
        return -100;
    }
    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        return creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    return 0;
}

module.exports = getenergy;