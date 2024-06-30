let  roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let enemy;
        for(const i in Memory.enemyIds){
            enemy=Game.getObjectById(Memory.enemyIds[i]);
            if(enemy)
                break;
        }
        if(enemy){
            if(creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE){
                creep.moveTo(enemy.pos);
            }
        }
        if(creep.hits<creep.hitsMax)
            creep.heal(creep);
    }
}
module.exports = roleDefender;