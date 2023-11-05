import { Environment } from "./engine/environment";
import { Actor } from "./engine/entity/actor";
import { CollisionEffects } from "./base/entity";

const viewSetup = () => {
    const canvas = document.createElement('canvas');
    if (!canvas) {
        throw new Error('Could not find canvas element');
    }
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not create canvas context');
    }
    return { canvas, ctx };
}


const { canvas, ctx } = viewSetup();
const env = new Environment({
    m: 50,
    n: 50,
    canvas,
    ctx,
    scale: 20,
});
env.load();

const p1Id = env.getId();
const p1Pos = env.grid.spawnPoint();
const p1 = new Actor({
    id: p1Id,
    groupIds: [],
    position: p1Pos,
    width: 1,
    height: 1,
    color: 'red',
    collisionEffect: CollisionEffects.BLOCK,
    speed: {
        x: 1,
        y: 1,
    },
    rigidity: 1,
}, env);

env.render();
env.registerActor(p1);