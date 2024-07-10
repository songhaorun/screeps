const roleHarvester = require('role_harvester');
const roleUpgrader = require('role_upgrader');
const roleBuilder = require('role_builder');
const roleCarrier = require('role_carrier');
const roleRepairer = require('role_repairer');
const roleTombstoneCarrier = require('role_tombstoneCarrier');
const roleMineralHarvester = require('role_mineral_harvester');
const roleMineralCarrier = require('role_mineral_carrier');
function creeps_run(){
    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
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
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'tombstoneCarrier':
                roleTombstoneCarrier.run(creep);
                break;
            case 'mineralHarvester':
                roleMineralHarvester.run(creep);
                break;
            case 'mineralCarrier':
                roleMineralCarrier.run(creep);
                break;
            default:
                console.log('Error:'+name+' has undefined role!'+creep.memory.role);
        }
    }
}
module.exports = creeps_run;