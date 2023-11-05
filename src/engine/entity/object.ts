import { IEntity, CollisionEffects } from '../../base/entity'
import { Position } from '../../base/position'
import { Rectangle } from '../../base/shape'
import { Environment } from '../environment'
import { InvalidEntitySpecError } from './error'

export class Obj implements IEntity {
  id: number
  groupIds: number[]
  type: string
  width: number
  height: number
  position: Position
  collisionEffect: CollisionEffects
  env: Environment
  color: string
  shape: Rectangle
  rigidity: number
  constructor(config: IEntity, env: Environment) {
    // Representational properties
    this.id = config.id
    this.groupIds = config.groupIds
    this.type = 'obj'

    // Spatial properties
    this.position = new Position(config.position.x, config.position.y);
    this.width = config.width
    this.height = config.height
    this.color = config.color
    this.shape = new Rectangle(this.width, this.height, this.id)
    this.rigidity = config.rigidity
    this.collisionEffect = config.collisionEffect

    this.env = env
    this.validate()
  }

  validate() {
    if (this.width <= 0) {
      throw new InvalidEntitySpecError(this.type, '.width must be greater than 0')
    }
    if (this.height <= 0) {
      throw new InvalidEntitySpecError(this.type, '.height must be greater than 0')
    }
  }

  render(ctx: CanvasRenderingContext2D, scale: number) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x * scale, this.position.y * scale, this.width * scale, this.height * scale)
  }
}
