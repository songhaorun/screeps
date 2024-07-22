/**
 * attack
 * @param {StructureTower} tower 
 */
function towerAttack(tower){
    const enermies = global.enermies[tower.room.name];
    const healers = global.healers[tower.room.name];
    let target;
    if(healers.length > 0)
        target = tower.pos.findClosestByRange(healers);
    else
        target = tower.pos.findClosestByRange(enermies);
    if(target){
        tower.attack(target);
        return true;
    }
    return false;
}

/**
 * heal
 * @param {StructureTower} tower 
 */
function towerHeal(tower){
    const healTarget=tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.hits<creep.hitsMax;
        }
    });
    if(healTarget){
        tower.heal(healTarget);
        return true;
    }
    return false;
}

/**
 * repair
 * @param {StructureTower} tower 
 */
function TowerRepair(tower){
    const repairTarget=tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return  (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) ? structure.hits<1000 : structure.hitsMax - structure.hits > 1000;
        }
    });
    if(repairTarget){
        tower.repair(repairTarget);
        return true;
    }
    return false;
}


function tower_run(){
    for(const room in Game.rooms){
        const towers=Game.rooms[room].find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER;
            }
        });
        if(towers.length > 0){
            for(const tower of towers){
                if(towerAttack(tower)){
                    continue;
                }
                else if(towerHeal(tower)){
                    continue;
                }
                else if(TowerRepair(tower)){
                    continue;
                }
            }
        }
    }
}

module.exports = tower_run;