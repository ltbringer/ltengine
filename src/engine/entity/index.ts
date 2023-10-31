import { Coordinates } from "../environment";

type Width = number;
type Height = number;
interface Size {
    width: Width,
    height: Height,
}


export enum Collision {
    Block,
    Bounce,
    Equip,
    Damage,
    StatBoost,
    Explode,
    Slow,
}

export enum EntityType {
    BASE,
    ACTOR,
    ITEM,
    PARTICLE
}

export interface EntityConfig {
    groupIds?: number[],
    type?: EntityType,
    coordinates: Coordinates,
    size: Size,
    color?: string | null,
    img?: string | null,
    rigidity?: number,
    onCollision: Collision,
    collisionDamage?: number,
}

export class Entity {
    id: number;
    type?: EntityType;
    groupIds: number[] = [];
    coordinates: Coordinates;
    color?: string | null;
    img?: string | null;
    size: Size;
    rigidity: number = 1;
    onCollision: Collision;
    collisionDamage: number = 0;

    constructor(id: number, config: EntityConfig) {
        this.id = id
        this.coordinates = config.coordinates
        this.color = config.color || null
        this.type = config.type || EntityType.BASE
        this.img = config.img || null
        this.onCollision = config.onCollision
        this.collisionDamage = config.collisionDamage || 0
        this.groupIds = config.groupIds || []
        if (config.color === null && config.img === null) {
            throw new Error('Entity must have a color or an image')
        }
        this.size = config.size
    }
}
