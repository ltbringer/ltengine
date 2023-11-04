import { Position } from "../../base/position";
import { Shape } from "../../base/shape";
import { Environment2D } from "../environment";

/**
 * An entity with a collision effect describes how another entity will be affected on collision.
 */
enum CollisionEffect {
    BOUNCE,
    EXPLODE,
    EQUIP,
    DAMAGE,
    BLOCK
}

export interface Entity {
    position: Position;
    shape: Shape;
    collisionEffect: CollisionEffect;
    env: Environment2D;
    render: (ctx: CanvasRenderingContext2D) => void;
    onCollision: (entity: Entity) => void;
}
