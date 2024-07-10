let getenergy = require('tools_getEnergy')
var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            delete creep.memory.targetId;
	    }
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
            if(!creep.memory.targetId){
                //寻找能量最低且最近wall或rampart并将id存到memory
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) && structure.hits < structure.hitsMax;
                    }
                });
                if(targets.length > 0) {
                    let target,minDistance;
                    for(const i in targets){
                        const ttarget = targets[i];
                        if(!target || (ttarget.hits < target.hits)) {
                            target = ttarget;
                            minDistance = (ttarget.pos.x-creep.pos.x)**2+(ttarget.pos.y-creep.pos.y)**2;
                        }
                        else if(ttarget.hits == target.hits){
                            const tdistance = (ttarget.pos.x-creep.pos.x)**2+(ttarget.pos.y-creep.pos.y)**2;
                            if(tdistance < minDistance){
                                target = ttarget;
                                minDistance = tdistance;
                            }
                        }
                    }
                    creep.memory.targetId=target.id;
                }
            }
            //work
            if(creep.memory.targetId){
                const target=Game.getObjectById(creep.memory.targetId);
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
            getenergy(creep,10000);
	    }
	}
}

module.exports = roleRepairer;