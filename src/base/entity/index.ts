import { Position } from '../position'
import { Environment } from '../../engine/environment'
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
  groupIds: string[]
  type: string
  symbol: string
  width: number
  height: number
  position: Position
  shape: Rectangle
  collisionEffect: CollisionEffects
  env: Environment
  render: (ctx: CanvasRenderingContext2D) => void
  onCollision: (entity: IEntity) => void
}
