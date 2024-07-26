function getbody(list){
    let body=[];
    for(const part in list)
        body=body.concat(new Array(list[part]).fill(part));
    return body;
}

function respawn(){

    let respawn={};

    for(const creepName in Memory.creeps) {
        if(!Game.creeps[creepName] && Memory.creeps[creepName].respawn == true) {
            const roomName = Memory.creeps[creepName].roomName;
            const role = Memory.creeps[creepName].role;
            if(!respawn[roomName])
                respawn[roomName] = [];

            if(role == 'carrier' || role == 'harvester')
                respawn[roomName].unshift(creepName);
            else
                respawn[roomName].push(creepName);

            Memory.creeps[creepName].working = false;
            delete Memory.creeps[creepName]._move;
        }
    }
    for(const roomName in Memory.rooms){
        for(const spawnName of Memory.rooms[roomName].spawnNames){
            if(Game.spawns[spawnName].spawning){
                const spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
                Game.spawns[spawnName].room.visual.text(
                    '🛠️' + spawningCreep.name,
                    Game.spawns[spawnName].pos.x + 1, 
                    Game.spawns[spawnName].pos.y, 
                    {align: 'left', opacity: 0.8});
            }
            else{
                if(respawn[roomName] && respawn[roomName].length > 0){
                    const creepName = respawn[roomName][0];
                    const flag=Game.spawns[spawnName].spawnCreep(getbody(Memory.body[Memory.creeps[creepName].role]),creepName);
                    if(flag==0)
                        console.log(`${spawnName} respawn creep: ${creepName}`);
                    else
                        console.log(`Error:${spawnName} spawn ${creepName} fault: ${flag}`);
                }
            }
        }
    }
}

module.exports = respawn;