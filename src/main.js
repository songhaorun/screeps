const respawn = require('respawn');
const tower_run = require('tower');
const creeps_run = require('creeps');
module.exports.loop = function () {
    respawn();
    tower_run();
    creeps_run();
    if(Game.cpu.bucket>=10000){
        Game.cpu.generatePixel();
    }
}