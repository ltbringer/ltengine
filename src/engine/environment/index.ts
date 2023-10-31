import { matrix } from '../../utils/matrix'
import { Actor, ActorEvent } from '../actor'
import { RenderEngine } from '../rendering';
import { Entity, Collision, EntityType } from '../entity';
import { Particle } from '../particle';

export const WALKABLE = 0;


export class Coordinates implements Coordinates {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    add(other: Coordinates): Coordinates {
        return new Coordinates(this.x + other.x, this.y + other.y)
    }

    diff(other: Coordinates): Coordinates {
        return new Coordinates(this.x - other.x, this.y - other.y)
    }

    reflection(): Coordinates {
        return new Coordinates(-this.x, -this.y)
    }

    clamp(min: number, max: number): Coordinates {
        const x = (this.x < min) ? min : (this.x > max) ? max : this.x
        const y = (this.y < min) ? min : (this.y > max) ? max : this.y
        return new Coordinates(x, y)
    }
}


export class Environment {
    // This assumes a square environment.
    dims: number;
    // This is a 2D array of numbers, where each number represents an entity.
    map: number[][];
    entities: Entity[];
    entityRegistry: Map<number, Entity>;
    renderEngine: RenderEngine;
    resolution: number;
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(dims: number, entities: Entity[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, resolution: number = 20) {
        this.dims = dims
        // Default environment allows walking anywhere.
        this.map = matrix.fill(dims, WALKABLE)
        this.entities = entities
        this.entityRegistry = new Map();
        this.resolution = resolution
        this.canvas = canvas
        this.ctx = ctx
        this.renderEngine = new RenderEngine(this.canvas, this.ctx, dims, this.resolution);

        window.addEventListener("actorMove", (e: Event) => {
            const evt = e as CustomEvent<ActorEvent>;
            this.motionHandler(evt.detail)
        })

        window.addEventListener("particleEffects", (e: Event) => {
            const evt = e as CustomEvent<Particle>;
            this.entities.push(evt.detail);
            this.entityRegistry.set(evt.detail.id, evt.detail)
            this.particleHandler(evt.detail, this.entities.length - 1)
        })
    }

    mapEntities(tick: number = 0) {
        type EntityMap = {
            entity: Entity,
            idx: number
        }
        const entitymap: Map<string, EntityMap> = new Map();
        this.entities.forEach((entity, idx) => {
            const { coordinates } = entity;
            const { x, y } = coordinates;
            entitymap.set(`${x},${y}`, { entity, idx });
        })

        for (let row = 0; row < this.dims; row++) {
            for (let col = 0; col < this.dims; col++) {
                const result = entitymap.get(`${col},${row}`);
                if (result) {
                    const { entity, idx } = result;
                    this.map[row][col] = entity.id || WALKABLE;
                    this.registerEntity(entity);
                    if (entity && entity.type === EntityType.PARTICLE && tick === 1) {
                        console.log(entity)
                        this.particleHandler(entity as Particle, idx)
                    }
                }
            }
        }
        return this;
    }

    registerEntity(entity: Entity) {
        if (!this.entityRegistry.get(entity.id)) {
            this.entityRegistry.set(entity.id, entity)
        }
    }

    render(debug: boolean = false) {
        this.renderEngine.render(this.map, this.entities, debug)
    }

    outOfBounds(entity: Entity, coordinates: Coordinates) {
        const { width, height } = entity.size;
        const leakLeft = coordinates.x < 0
        const leakRight = coordinates.x + width > this.dims
        const leakTop = coordinates.y < 0
        const leakBottom = coordinates.y + height > this.dims

        if (leakLeft || leakRight || leakTop || leakBottom) {
            return true
        }
        return false
    }

    collisionDetection(nextPos: Coordinates): Entity | null {
        const { x, y } = nextPos;
        const entityId = this.map[y][x];
        const entity = this.entityRegistry.get(entityId);
        if (entity) {
            return entity
        }
        return null
    }

    unregisterPos(e: Entity) {
        const { x, y } = e.coordinates;
        this.map[y][x] = WALKABLE
    }

    registerPos(e: Entity) {
        const { x, y } = e.coordinates;
        this.map[y][x] = e.id
    }

    allowMotion(actor: Actor, nextPos: Coordinates) {
        this.unregisterPos(actor);
        actor.motionUpdate(nextPos);
        this.registerPos(actor);
    }

    motionHandler(e: ActorEvent) {
        const { coordinates, actor } = e;
        let nextPos = coordinates;
        if (this.outOfBounds(actor, nextPos)) {
            return;
        }
        const collidingEntity = this.collisionDetection(nextPos);
        if (collidingEntity) {
            nextPos = this.collision(actor, collidingEntity, nextPos);
        }
        this.allowMotion(actor, nextPos);
    }

    particleHandler(particle: Particle, index: number) {
        const { coordinates, destination, speed } = particle;
        if (this.outOfBounds(particle, destination)) {
            this.entities.splice(index, 1);
            this.unregisterPos(particle);
            return;
        }
        const diff = new Coordinates(destination.x - coordinates.x, destination.y - coordinates.y)
        const diffClamped = diff.clamp(-1, 1)
        const nextPos = coordinates.add(new Coordinates(speed.x * diffClamped.x, speed.y * diffClamped.y));
        console.log(coordinates)
        console.log(nextPos)
        const collidingEntity = this.collisionDetection(nextPos);
        particle.coordinates = nextPos;

        console.log(this.map)
        console.log(this.entities[index])

        if (collidingEntity) {
            this.entities.splice(index, 1);
            this.unregisterPos(particle);
            return;
        }
    }

    collision(actor: Actor, hitEntity: Entity, nextPos: Coordinates): Coordinates {
        switch (hitEntity.onCollision) {
            case Collision.Block:
                return actor.coordinates
            case Collision.Bounce:
                // Identify motion vector and reverse it.
                const diff = new Coordinates(nextPos.x - actor.coordinates.x, nextPos.y - actor.coordinates.y)
                const reflection = diff.reflection()
                return actor.coordinates.add(reflection)
            case Collision.Damage:
                // Bounce and apply damage.
                return actor.coordinates
            case Collision.Equip:
                // colliding entity should be removed from the map and entity registry.
                return nextPos
            case Collision.StatBoost:
                // colliding entity should be removed from the map and entity registry.
                return nextPos
            case Collision.Explode:
                // colliding entity should be removed from the map and entity registry.
                return actor.coordinates
            case Collision.Slow:
                return actor.coordinates
            default:
                return actor.coordinates
        }
    }

    run(grid: boolean = false) {
        let lastTime = 0;
        let frameCount = 0;
        let fps = 0;
        const loop = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds

            // Calculate FPS
            frameCount++;
            if (deltaTime > 1) {
                fps = frameCount / deltaTime;
                frameCount = 0;
                lastTime = currentTime;
            }

            if (fps > 60) {
                this.mapEntities(1);
            } else {
                this.mapEntities(0);
            }
            this.render(grid);

            // Log FPS
            console.log(`FPS: ${fps.toFixed(2)}`);

            // Request the next frame
            window.requestAnimationFrame(loop);
        };
        loop(0);
    }
}

export const environment = {
    env: Environment
}
