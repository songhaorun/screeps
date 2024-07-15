function init(){
    global.tombstones = {};
    global.droppedResources = {};
    global.myConstructionSite = {};
    
    for(const roomName in Game.rooms){

        global.tombstones[roomName] = Game.rooms[roomName].find(FIND_TOMBSTONES,{
            filter: (tombstone)=>{
                return tombstone.store.getUsedCapacity() > 0 && tombstone.resourceType != RESOURCE_ENERGY || tombstone.amount > 100;
            }
        });
        global.droppedResources[roomName] = Game.rooms[roomName].find(FIND_DROPPED_RESOURCES,{
            filter: (resource)=>{
                return resource.resourceType !=RESOURCE_ENERGY || resource.amount > 100;
            }
        });
        global.myConstructionSite[roomName] = Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES);

        if(!Game.creeps[roomName+'_TombstoneCarrier'])
            Memory.creeps[roomName+'_TombstoneCarrier'].role = 'tombstoneCarrier';
        else if(global.tombstones[roomName].length > 0 || global.droppedResources[roomName].length > 0){
            if(!Memory.creeps[roomName+'_TombstoneCarrier'])
                Memory.creeps[roomName+'_TombstoneCarrier'] = {};
            Memory.creeps[roomName+'_TombstoneCarrier'].role = 'tombstoneCarrier';
        }
        else
            Memory.creeps[roomName+'_TombstoneCarrier'].role = 'carrier';

        if(!Game.creeps[roomName+'_Builder'])
            Memory.creeps[roomName+'_Builder'].role = 'builder';
        else if(global.myConstructionSite[roomName].length > 0){
            if(!Memory.creeps[roomName+'_Builder'])
                Memory.creeps[roomName+'_Builder'] = {};
            Memory.creeps[roomName+'_Builder'].role = 'builder';
            delete Memory.creeps[roomName+'_Builder'].targetId;
        }
        else
            Memory.creeps[roomName+'_Builder'].role = 'repairer';
    }
}
module.exports = init;