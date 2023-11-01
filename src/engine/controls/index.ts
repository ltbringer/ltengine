import { Actor } from "../actor";
import { Coordinates } from "../environment";
import { random } from "../../utils/numbers";

interface KeyBindings {
    UP: string[],
    DOWN: string[],
    LEFT: string[],
    RIGHT: string[],
    ITEM: RegExp,
}


const keys: KeyBindings = {
    UP: ['ArrowUp', 'KeyW'],
    DOWN: ['ArrowDown', 'KeyS'],
    LEFT: ['ArrowLeft', 'KeyA'],
    RIGHT: ['ArrowRight', 'KeyD'],
    ITEM: /^Digit(\d)$/,
};

export class Control {
    actor: Actor;

    constructor(actor: Actor) {
        this.actor = actor;
    }

    moveUp() {
        this.actor.moveTo(new Coordinates(
            this.actor.coordinates.x,
            this.actor.coordinates.y - this.actor.maxSpeed.y)
        );
    }

    moveRight() {
        this.actor.moveTo(new Coordinates(
            this.actor.coordinates.x + this.actor.maxSpeed.x,
            this.actor.coordinates.y)
        );
    }

    moveBottom() {
        this.actor.moveTo(new Coordinates(
            this.actor.coordinates.x,
            this.actor.coordinates.y + this.actor.maxSpeed.y)
        );
    }

    moveLeft() {
        this.actor.moveTo(new Coordinates(
            this.actor.coordinates.x - this.actor.maxSpeed.x,
            this.actor.coordinates.y)
        );
    }

    pickItem(idx: number) {
        if (this.actor.inventory[idx]) {
            this.actor.activeItem = this.actor.inventory[idx];
        }
    }
}

export const manualCtl = (canvas: HTMLCanvasElement, resolution: number) => (ctl: Control) => {
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
        const itemKey = keys.ITEM.exec(e.code);
        if (itemKey && itemKey.length > 1) {
            const itemIndex = parseInt(itemKey[1]) - 1;
            ctl.pickItem(itemIndex < 0 ? 10 : itemIndex);
        }
    }
    canvas.onclick = (e) => {
        const x = Math.floor(e.offsetX / resolution);
        const y = Math.floor(e.offsetY / resolution);
        window.dispatchEvent(new CustomEvent('actorClick', { detail: { coordinates: { x, y }, actor: ctl.actor }, bubbles: false }))
    }
}

export const randomCtl = (ctl: Control): void => {
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