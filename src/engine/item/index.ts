import { EntityConfig, Entity, EntityType } from "../entity";
import { Actor, ActorEvent } from "../actor";


interface EffectConfig {
    name: string;
    description: string;
    limit: number;
    cooldown: number;
    active: (actor: ActorEvent) => void;
    passive: (actor: Actor) => void;
}

export class Effect {
    name: string;
    description: string;
    limit: number;
    cooldown: number;
    active: (actor: ActorEvent) => void;
    passive: (actor: Actor) => void;
    constructor(config: EffectConfig) {
        this.name = config.name
        this.description = config.description
        this.cooldown = config.cooldown
        this.active = config.active
        this.passive = config.passive
        this.limit = config.limit
    }
}

interface ItemConfig extends EntityConfig {
    name: string,
    effects: Effect[]
    status?: ItemStatus
}

export enum ItemStatus {
    Equipped,
    Dropped
}

export class Item extends Entity {
    name: string
    effects: Effect[]
    status: ItemStatus = ItemStatus.Dropped

    constructor(id: number, config: ItemConfig) {
        super(id, { ...config, type: EntityType.ITEM })
        this.name = config.name
        this.effects = config.effects
        this.status = config.status || ItemStatus.Dropped
    }

    equip(actor: Actor) {
        this.passiveEffects(actor)
        actor.addToInventory(this)
    }

    use(e: ActorEvent) {
        for (const effect of this.effects) {
            if (effect.limit > 0) {
                effect.active(e)
            }
        }
    }

    private passiveEffects(actor: Actor) {
        for (const effect of this.effects) {
            effect.passive(actor)
        }
    }
}
