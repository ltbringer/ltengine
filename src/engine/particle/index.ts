import { EntityConfig, Entity, EntityType } from "../entity";
import { Coordinates } from "../environment";
import { Collision } from "../entity";
import { Speed } from "../actor";


interface ParticleConfig extends EntityConfig {
    name: string,
    destination: Coordinates,
    speed: Speed,
    destinationLocked: boolean,
    moveSpeed: number,
}


export class Particle extends Entity {
    name: string;
    destination: Coordinates;
    speed: Speed;
    destinationLocked: boolean;
    moveSpeed: number;
    constructor(id: number, config: ParticleConfig) {
        super(id, { ...config, type: EntityType.PARTICLE, onCollision: Collision.Damage })
        this.name = config.name
        this.destination = config.destination
        this.speed = config.speed
        this.destinationLocked = config.destinationLocked
        this.moveSpeed = config.moveSpeed
    }

    setDestination(d: Coordinates) {
        this.destinationLocked = true
        this.destination = d
    }

    emit() {
        if (!this.destinationLocked) {
            return
        }
        window.dispatchEvent(new CustomEvent("particleEmit", { detail: { particle: this }, bubbles: false }));
    }
}
