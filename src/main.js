var roleHarvester = require('role_harvester');
var roleUpgrader = require('role_upgrader');
var roleBuilder = require('role_builder');
var roleCarrier = require('role_carrier');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name] && Memory.creeps[name].respawn == true) {
            if(!Game.spawns['Spawn1'].spawning){
                let body=Memory.body[Memory.creeps[name].role];
                let flag=Game.spawns['Spawn1'].spawnCreep(body,name);
                if(flag==0)
                    console.log('Respawn creep:', name);
                else
                    console.log('Error:Respawn creep fault '+flag);
            }
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role){
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'carrier':
                roleCarrier.run(creep);
                break;
            default:
                console.log('Error:'+name+'has undefined role!');
        }
    }
}