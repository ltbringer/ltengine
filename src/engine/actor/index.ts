import { Coordinates } from "../environment";
import { EntityConfig, Entity, EntityType } from "../entity";
import { Control } from "../controls";
import { Item } from "../item";

export class Speed {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}


interface ActorConfig extends EntityConfig {
    maxSpeed: Speed,
    ctl?: Control | null
    inventory?: Item[]
}

export interface ActorEvent {
    coordinates: Coordinates,
    actor: Actor,
}

export class Actor extends Entity {
    maxSpeed: Speed;
    ctl?: Control | null;
    inventory: Item[] = [];
    activeItem: Item | null;

    constructor(id: number, config: ActorConfig) {
        super(id, { ...config, type: EntityType.ACTOR })
        this.maxSpeed = config.maxSpeed
        this.ctl = null
        this.inventory = config.inventory || []
        this.activeItem = this.inventory[0] || null
        window.addEventListener("actorClick", (e: Event) => {
            const evt = e as CustomEvent<ActorEvent>;
            this.useItem(evt.detail)
        })
    }

    moveTo(coordinates: Coordinates) {
        window.dispatchEvent(new CustomEvent("actorMove", { detail: { coordinates, actor: this }, bubbles: false }));
    }

    motionUpdate(coordinates: Coordinates) {
        this.coordinates = coordinates;
    }

    setCtl(f: (ctl: Control) => void) {
        f(new Control(this))
        return this
    }

    addToInventory(item: Item) {
        this.inventory.push(item)
        return this
    }

    useItem(e: ActorEvent) {
        if (this.activeItem) {
            this.activeItem.use(e)
        }
    }
}
