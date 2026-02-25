import { errorMapper } from '@/modules/errorMapper'
import init from '@/loop/init';
import respawn from '@/loop/respawn';
import tower from '@/loop/tower';
import creeps from '@/loop/creeps';
import link from '@/loop/link';
export const loop = errorMapper(() => {
    init();
    respawn();
    tower();
    creeps();
    link();

    Game.cpu.generatePixel();
})