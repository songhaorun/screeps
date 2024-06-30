let getNearest = require('tools_getNearest');

/**
 * attack
 * @param {StructureTower} tower 
 */
function towerAttack(tower){
    let attcktTarget=tower.room.find(FIND_HOSTILE_CREEPS);
    if(attcktTarget.length>0){
        tower.attack(getNearest(tower.pos,attcktTarget));
        return true;
    }
    return false;
}

/**
 * heal
 * @param {StructureTower} tower 
 */
function towerHeal(tower){
    let healTarget=tower.room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.hits<creep.hitsMax;
        }
    });
    if(healTarget.length > 0){
        tower.heal(healTarget[0]);
        return true;
    }
    return false;
}

/**
 * repair
 * @param {StructureTower} tower 
 */
function TowerRepair(tower){
    let repairTarget=tower.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return  structure.structureType != STRUCTURE_WALL && structure.hitsMax > structure.hits;
        }
    });
    if(repairTarget.length > 0){
        tower.repair(repairTarget[0]);
        return true;
    }
    return false;
}


function tower_run(){
    let tower=Game.getObjectById('66816df3e74387900c348ac5');
    if(towerAttack(tower)){
        return 1000;
    }
    else if(towerHeal(tower)){
        return 1001;
    }
    else if(TowerRepair(tower)){
        return 1002;
    }
    return 0;
}

module.exports = tower_run;