/** @param {Creep} creep **/
function getenergy(creep){
    //有预设能量源优先使用
    let sourceid=creep.memory.sourceid;
    //无预设能量源使用最近能量源
    if(!sourceid){
        let minDistance;
        for(const i in creep.room.memory.provideEnergyIds){
            const tprovideEnergyId=creep.room.memory.provideEnergyIds[i];
            const tprovideEnergy=Game.getObjectById(tprovideEnergyId);
            if(tprovideEnergy.store.getUsedCapacity()==0)
                continue;
            const tDistance=(tprovideEnergy.pos.x-creep.pos.x)**2+(tprovideEnergy.pos.y-creep.pos.y)**2;
            if(minDistance==null || tDistance < minDistance){
                minDistance=tDistance;
                sourceid=tprovideEnergyId;
            }
        }
    }
    if(!sourceid){
        console.log("ERROR:"+creep.name+"has no energe source!");
        return -100;
    }
    const source=Game.getObjectById(sourceid);
    if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        return creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    return 0;
}

module.exports = getenergy;