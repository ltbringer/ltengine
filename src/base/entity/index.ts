import { IPosition } from '../position'
import { Rectangle } from '../shape'

/**
 * An entity with a collision effect describes how another entity will be affected on collision.
 */
export enum CollisionEffects {
  BOUNCE,
  EXPLODE,
  EQUIP,
  DAMAGE,
  BLOCK,
}

export interface IEntity {
  id: number
  groupIds: number[]
  width: number
  height: number
  position: IPosition
  collisionEffect: CollisionEffects
  color: string
}
