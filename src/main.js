const respawn = require('respawn');
const tower_run = require('tower');
const creeps_run = require('creeps');
module.exports.loop = function () {
    respawn();
    tower_run();
    creeps_run();
}