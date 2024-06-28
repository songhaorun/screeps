var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let workpos=creep.memory.workpos
        if(creep.pos.x === workpos.x && creep.pos.y === workpos.y && creep.pos.roomName === workpos.roomName) {
            let source = Game.getObjectById(creep.memory.sourceid);
            creep.harvest(source);
        }
        else {
            creep.moveTo(workpos.x,workpos.y,{visualizePathStyle: {stroke: '#ffaa00'}});
        }
	}
};

module.exports = roleHarvester;