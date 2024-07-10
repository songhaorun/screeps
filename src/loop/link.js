function link_run(){
    for(const room in Game.rooms){
        const upgradeLink=Game.getObjectById(Memory.rooms[room].linkIds.upgradeLink);
        if(upgradeLink.store.getFreeCapacity(RESOURCE_ENERGY) > 200)
            for(const i in Memory.rooms[room].linkIds.harvestLink){
                const harvestLink=Game.getObjectById(Memory.rooms[room].linkIds.harvestLink[i]);
                harvestLink.transferEnergy(upgradeLink);
            }
    }
}
module.exports = link_run;