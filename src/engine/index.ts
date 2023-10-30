import { Environment } from "./environment";
import { Actor } from "./actor";
import { Control, keyCtl, randomCtl } from "./controls";
import { Entity, Collision } from "./entity";

const p1 = new Actor(1, {
    coordinates: {
        x: 30,
        y: 30
    },
    size: {
        width: 1,
        height: 1
    },
    color: 'red',
    img: null,
    speed: {
        x: 1,
        y: 1
    },
    onCollision: Collision.Damage
})

const p2 = new Actor(2, {
    coordinates: {
        x: 10,
        y: 10
    },
    size: {
        width: 1,
        height: 1
    },
    color: 'blue',
    img: null,
    speed: {
        x: 1,
        y: 1
    },
    onCollision: Collision.Damage
})

const walls = new Array(20).fill(1).map((e, i) => new Entity(3, {
    coordinates: {
        x: 20 + i,
        y: 20
    },
    size: {
        width: 1,
        height: 1
    },
    color: 'black',
    img: null,
    onCollision: Collision.Bounce
}))


const p1Ctl = new Control(p1)
const p2Ctl = new Control(p2)
const env = new Environment(50, [...walls, p1, p2], '#game').mapEntities();

const showGrid = true
keyCtl(p1Ctl)
randomCtl(p2Ctl)

env.run(showGrid);
