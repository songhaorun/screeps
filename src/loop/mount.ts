import { Role } from "@/role/Role";
import { addCreep, addHarvesterBySource, setCreep, removeCreep, removeCreepMemory } from "./utils/commendCreep";
import { BodyConfigs, getBody } from "./utils/bodyConfig";
import { updateRoomId } from "./utils/updateRoomId";

declare global {
    namespace NodeJS {
        interface Global {
            Role: typeof Role;
            addCreep: typeof addCreep;
            addHarvesterBySource: typeof addHarvesterBySource;
            setCreep: typeof setCreep;
            removeCreep: typeof removeCreep;
            removeCreepMemory: typeof removeCreepMemory;
            getBody: typeof getBody;
            BodyConfigs: typeof BodyConfigs;
            updateRoomId: typeof updateRoomId;
        }
    }
}

export function mountGlobal() {
    global.Role = Role;
    global.addCreep = addCreep;
    global.addHarvesterBySource = addHarvesterBySource;
    global.setCreep = setCreep;
    global.removeCreep = removeCreep;
    global.removeCreepMemory = removeCreepMemory;
    global.getBody = getBody;
    global.BodyConfigs = BodyConfigs;
    global.updateRoomId = updateRoomId;
}
