import { Coordinates } from "../environment";
import { EntityConfig, Entity } from "../entity";

class Speed {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

interface ActorConfig extends EntityConfig {
    speed: Speed,
}

export interface ActorMove {
    coordinates: Coordinates,
    actor: Actor,
}

export class Actor extends Entity {
    speed: Speed;

    constructor(id: number, config: ActorConfig) {
        super(id, config)
        this.speed = config.speed
    }

    moveTo(coordinates: Coordinates) {
        window.dispatchEvent(new CustomEvent("actorMove", { detail: { coordinates, actor: this }, bubbles: false }));
    }

    motionUpdate(coordinates: Coordinates) {
        this.coordinates = coordinates;
    }
}
