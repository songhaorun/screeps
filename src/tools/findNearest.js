/**
 * @param {RoomPosition} pos
 * @param {Array} list
*/
function findNearest(pos,list) {
    let minDistance,ans;
    for(const i in list){
        const object=list[i];
        const tDistance=(object.pos.x-pos.x)**2+(object.pos.y-pos.y)**2;
        if(minDistance==null || tDistance < minDistance){
            minDistance=tDistance;
            ans=object;
        }
    }
    return ans;
}

module.exports = findNearest;