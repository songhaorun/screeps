let  roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const enermies = global.enermies[creep.room.name];
        const healers = global.healers[creep.room.name];
        let target;
        if(healers.length > 0)
            target = creep.pos.findClosestByRange(healers);
        else
            target = creep.pos.findClosestByRange(enermies);
        if(target){
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }
        if(creep.hits<creep.hitsMax)
            creep.heal(creep);
    }
}
module.exports = roleDefender;