function getbody(list){
    let body=[];
    for(const part in list)
        body=body.concat(new Array(list[part]).fill(part));
    return body;
}

function respawn(){
    for(const name in Memory.creeps) {
        if(!Game.creeps[name] && Memory.creeps[name].respawn == true) {
            if(!Game.spawns['Spawn1'].spawning){
                const flag=Game.spawns['Spawn1'].spawnCreep(getbody(Memory.body[Memory.creeps[name].role]),name);
                if(flag==0)
                    console.log('Respawn creep:', name);
                else
                    console.log('Error:Respawn '+name+' fault '+flag);
            }
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
}

module.exports = respawn;