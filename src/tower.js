/**
 * attack
 * @param {StructureTower} tower 
 */
function towerAttack(tower){
    let attcktTarget=tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(attcktTarget){
        tower.attack(attcktTarget);
        return true;
    }
    return false;
}

/**
 * heal
 * @param {StructureTower} tower 
 */
function towerHeal(tower){
    let healTarget=tower.pos.findClosestByRange(FIND_MY_CREEPS, {
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
    let repairTarget=tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return  (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) ? structure.hits<1000 : structure.hitsMax > structure.hits;
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
            for(const i in towers){
                let tower = towers[i]
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