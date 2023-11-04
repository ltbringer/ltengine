import { IEntity, CollisionEffects } from '../../base/entity'
import { Position } from '../../base/position'
import { Rectangle } from '../../base/shape'
import { Environment } from '../environment'
import { InvalidEntitySpecError } from './error'

export class Obj implements IEntity {
  id: number
  groupIds: string[]
  type: string
  width: number
  height: number
  symbol: string
  shape: Rectangle
  position: Position
  collisionEffect: CollisionEffects
  env: Environment
  render: (ctx: CanvasRenderingContext2D) => void
  onCollision: (entity: IEntity) => void
  constructor(config: IEntity, env: Environment) {
    // Representational properties
    this.id = config.id
    this.groupIds = config.groupIds
    this.type = 'obj'
    this.symbol = config.symbol

    // Spatial properties
    this.position = config.position
    this.width = config.width
    this.height = config.height
    this.shape = new Rectangle(this.width, this.height, this.id)
    this.collisionEffect = config.collisionEffect

    this.env = env
    this.render = config.render
    this.onCollision = config.onCollision
    this.validate()
  }

  validate() {
    if (this.width <= 0) {
      throw new InvalidEntitySpecError(this.type, '.width must be greater than 0')
    }
    if (this.height <= 0) {
      throw new InvalidEntitySpecError(this.type, '.height must be greater than 0')
    }
    if (this.symbol.length !== 1) {
      throw new InvalidEntitySpecError(this.type, '.symbol must be a single character')
    }
  }
}
