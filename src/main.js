const init = require('loop_init');
const respawn = require('loop_respawn');
const tower = require('loop_tower');
const creeps = require('loop_creeps');
const link = require('loop_link');
module.exports.loop = function () {
    init();
    respawn();
    tower();
    creeps();
    link();
    Game.cpu.generatePixel();
}