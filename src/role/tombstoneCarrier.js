let roleTombstoneCarrier = {
    
    /** @param {Creep} creep **/
    run:function(creep){
        if(creep.store.getFreeCapacity() == 0){
            creep.memory.working = false;
        }
        if(creep.store.getUsedCapacity() == 0){
            creep.memory.working = true;
        }
        if(creep.memory.working) {
            if(global.tombstones[creep.room.name].length > 0){
                const target = creep.pos.findClosestByPath(global.tombstones[creep.room.name]);
                for(const resource in target.store){
                    if(creep.withdraw(target,resource) == ERR_NOT_IN_RANGE){
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                        break;
                    }
                    if(creep.store.getFreeCapacity() == 0)
                        break;
                }
            }
            else{
                const target = creep.pos.findClosestByPath(global.droppedResources[creep.room.name]);
                if(creep.pickup(target) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target,{visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else{
            for(const resource in creep.store){
                if(creep.transfer(creep.room.storage,resource) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.storage,{visualizePathStyle: {stroke: '#ffffff'}});
                    break;
                }
                if(creep.room.storage.store.getFreeCapacity() == 0)
                    break;
            }
        }
    }
}
module.exports = roleTombstoneCarrier;