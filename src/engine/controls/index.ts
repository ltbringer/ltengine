import { Actor } from "../actor";
import { Coordinates } from "../environment";
import { random } from "../../utils/numbers";

interface KeyBindings {
    UP: string[],
    DOWN: string[],
    LEFT: string[],
    RIGHT: string[],
}

const keys: KeyBindings = {
    UP: ['ArrowUp', 'KeyW'],
    DOWN: ['ArrowDown', 'KeyS'],
    LEFT: ['ArrowLeft', 'KeyA'],
    RIGHT: ['ArrowRight', 'KeyD']
};

export class Control {
    actor: Actor;

    constructor(actor: Actor) {
        this.actor = actor;
    }

    moveUp() {
        this.actor.moveTo(new Coordinates(
            this.actor.coordinates.x,
            this.actor.coordinates.y - this.actor.speed.y)
        );
    }

    moveRight() {
        this.actor.moveTo(new Coordinates(
            this.actor.coordinates.x + this.actor.speed.x,
            this.actor.coordinates.y)
        );
    }

    moveBottom() {
        this.actor.moveTo(new Coordinates(
            this.actor.coordinates.x,
            this.actor.coordinates.y + this.actor.speed.y)
        );
    }

    moveLeft() {
        this.actor.moveTo(new Coordinates(
            this.actor.coordinates.x - this.actor.speed.x,
            this.actor.coordinates.y)
        );
    }
}

export const keyCtl = (ctl: Control) => {
    window.onkeydown = (e) => {
        if (keys.UP.includes(e.code)) {
            ctl.moveUp();
        }
        if (keys.DOWN.includes(e.code)) {
            ctl.moveBottom();
        }
        if (keys.LEFT.includes(e.code)) {
            ctl.moveLeft();
        }
        if (keys.RIGHT.includes(e.code)) {
            ctl.moveRight();
        }
    }
}

export const randomCtl = (ctl: Control) => {
    const randomWalk = () => {
        const rand = random(0, 3);
        switch (rand) {
            case 0:
                ctl.moveUp();
                break;
            case 1:
                ctl.moveBottom();
                break;
            case 2:
                ctl.moveLeft();
                break;
            case 3:
                ctl.moveRight();
                break;
            default:
                break;
        }
    }
    setInterval(randomWalk, 1000);
}