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

export interface EntityConfig {
    coordinates: Coordinates,
    size: Size,
    color: string | null,
    img: string | null,
    rigidity?: number,
    onCollision: Collision,
}

export class Entity {
    id: number;
    coordinates: Coordinates;
    color: string | null;
    img: string | null;
    size: Size;
    rigidity: number = 1;
    onCollision: Collision;

    constructor(id: number, config: EntityConfig) {
        this.id = id
        this.coordinates = config.coordinates
        this.color = config.color || null
        this.img = config.img || null
        this.onCollision = config.onCollision
        if (config.color === null && config.img === null) {
            throw new Error('Entity must have a color or an image')
        }
        this.size = config.size
    }
}
