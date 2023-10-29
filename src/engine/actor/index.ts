import { Coordinates } from "../environment";

class Speed {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

interface ActorConfig {
    coordinates: Coordinates,
    speed: Speed
}

export class Actor {
    coordinates: Coordinates;
    speed: Speed;

    constructor(config: ActorConfig) {
        this.coordinates = config.coordinates
        this.speed = config.speed
    }

    moveTo(coordinates: Coordinates) {
        // 1. clamp by bounds, collision
        // 2. move Animation
        // 3. update coordinates
    }
}
