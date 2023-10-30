import { matrix } from '../../utils/matrix'
import { Actor, ActorMove } from '../actor'
import { RenderEngine } from '../rendering';
import { Entity, Collision } from '../entity';

export const WALKABLE = 0;

export class Coordinates {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
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

    constructor(dims: number, entities: Entity[], canvasId: string) {
        this.dims = dims
        // Default environment allows walking anywhere.
        this.map = matrix.fill(dims, WALKABLE)
        this.entities = entities
        this.entityRegistry = new Map();
        this.renderEngine = new RenderEngine(canvasId, dims);
        window.addEventListener("actorMove", (e: Event) => {
            const evt = e as CustomEvent<ActorMove>;
            this.motionHandler(evt.detail)
        })
    }

    mapEntities() {
        for (const entity of this.entities) {
            const { coordinates, size } = entity;
            const { x, y } = coordinates;
            const { width, height } = size;
            for (let row = y; row < y + height; row++) {
                for (let col = x; col < x + width; col++) {
                    this.map[row][col] = entity.id
                    if (!this.entityRegistry.get(entity.id)) {
                        this.entityRegistry.set(entity.id, entity)
                    }
                }
            }
        }
        return this;
    }

    render(debug: boolean = false) {
        this.renderEngine.render(this.map, this.entities, debug)
    }

    outOfBounds(actor: Actor, coordinates: Coordinates) {
        const { width, height } = actor.size;
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

    unregisterActorPos(actor: Actor) {
        const { x, y } = actor.coordinates;
        this.map[y][x] = WALKABLE
    }

    registerActorPos(actor: Actor) {
        const { x, y } = actor.coordinates;
        this.map[y][x] = actor.id
    }

    approveMotion(actor: Actor, nextPos: Coordinates) {
        this.unregisterActorPos(actor);
        actor.motionUpdate(nextPos);
        this.registerActorPos(actor);
    }

    motionHandler(e: ActorMove) {
        const { coordinates, actor } = e;
        let nextPos = coordinates;
        if (this.outOfBounds(actor, nextPos)) {
            return;
        }
        const collidingEntity = this.collisionDetection(nextPos);
        if (collidingEntity) {
            nextPos = this.collision(actor, collidingEntity, nextPos);
        }
        this.approveMotion(actor, nextPos);
    }

    collision(entity: Entity, collidingEntity: Entity, nextPos: Coordinates): Coordinates {
        switch (collidingEntity.onCollision) {
            case Collision.Block:
                return entity.coordinates
            case Collision.Bounce:
                // Identify motion vector and reverse it.
                return new Coordinates(entity.coordinates.x + 2, entity.coordinates.y + 2)
            case Collision.Damage:
                // Bounce and apply damage.
                return entity.coordinates
            case Collision.Equip:
                // colliding entity should be removed from the map and entity registry.
                return nextPos
            case Collision.StatBoost:
                // colliding entity should be removed from the map and entity registry.
                return nextPos
            case Collision.Explode:
                // colliding entity should be removed from the map and entity registry.
                return entity.coordinates
            case Collision.Slow:
                return entity.coordinates
            default:
                return entity.coordinates
        }
    }

    run(grid: boolean = false) {
        const loop = () => {
            this.render(grid);
            window.requestAnimationFrame(loop);
        }
        loop();
    }
}

export const environment = {
    env: Environment
}
