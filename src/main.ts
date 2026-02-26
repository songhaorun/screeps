import { ErrorMapper } from '@/utils/ErrorMapper';
// import { update } from '@/loop/update';
import { respawn } from '@/loop/respawn';
// import { tower } from '@/loop/tower';
import { creeps } from '@/loop/creeps';
// import { link } from '@/loop/link';
import { mountGlobal } from '@/loop/mount';

mountGlobal();

export const loop = ErrorMapper.wrapLoop(() => {
    // update();
    respawn();
    // tower();
    // link();
    creeps();

    if (Game.cpu.bucket >= 10000)
        Game.cpu.generatePixel();
})