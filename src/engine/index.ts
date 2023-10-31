import { Coordinates, Environment } from "./environment";
import { Actor, ActorEvent } from "./actor";
import { manualCtl, randomCtl } from "./controls";
import { Entity, Collision } from "./entity";
import { Item, Effect, ItemStatus } from "./item";
import { Particle } from "./particle";

const canvasId = '#game'
const canvas: HTMLCanvasElement | null = document.querySelector(canvasId)
const ctx = canvas?.getContext("2d")
const dimensions = 50;
const pxResolution = 20;
const showGrid = true;

if (!canvas || !ctx) {
    throw new Error(`Canvas ${canvasId} not found`)
}

const p1 = new Actor(1, {
    coordinates: new Coordinates(Math.floor(dimensions / 2), Math.floor(dimensions / 2)),
    size: {
        width: 1,
        height: 1
    },
    color: 'rgba(255, 0, 0, 0.5)',
    img: null,
    maxSpeed: {
        x: 1,
        y: 1
    },
    onCollision: Collision.Damage,
}).setCtl(manualCtl(canvas, pxResolution))

const item = new Item(25, {
    name: 'Pulse Gun',
    coordinates: p1.coordinates,
    size: {
        width: 1,
        height: 1
    },
    color: 'rgba(0, 0, 0, 0)',
    img: null,
    onCollision: Collision.Equip,
    status: ItemStatus.Equipped,
    effects: [new Effect({
        name: '22mm',
        description: 'Low damage ranged attack.',
        limit: 100,
        cooldown: 1000,
        active: (e: ActorEvent) => {
            const bullet = new Particle(35, {
                name: 'pulse bullet',
                coordinates: p1.coordinates,
                size: {
                    width: 0.2,
                    height: 0.2
                },
                color: 'rgba(255, 0, 0, 1)',
                onCollision: Collision.Damage,
                collisionDamage: 10,
                destination: e.coordinates,
                destinationLocked: true,
                speed: {
                    x: 1,
                    y: 1
                },
            })
            window.dispatchEvent(new CustomEvent('particleEffects', { detail: bullet }))
        },
        passive: (actor: Actor) => { }
    })]
})
p1.addToInventory(item)

const p2 = new Actor(2, {
    coordinates: new Coordinates(Math.floor(dimensions * 0.1), Math.floor(dimensions * 0.1)),
    size: {
        width: 1,
        height: 1
    },
    color: 'rgba(0, 0, 255, 0.5)',
    img: null,
    maxSpeed: {
        x: 1,
        y: 1
    },
    onCollision: Collision.Damage
}).setCtl(randomCtl)

const walls = new Array(20).fill(1).map((e, i) => new Entity(3, {
    coordinates: new Coordinates(20 + i, 20),
    size: {
        width: 1,
        height: 1
    },
    color: 'black',
    img: null,
    onCollision: Collision.Bounce
}))

const env = new Environment(dimensions, [...walls, p1, p2], canvas, ctx, pxResolution);
env.run(showGrid);
