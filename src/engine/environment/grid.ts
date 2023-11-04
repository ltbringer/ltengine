import { Matrix } from '../../utils/matrix'
import { Position, IPosition } from '../../base/position'
import { IEntity } from '../../base/entity'

export const EMPTY = 0

export class Grid {
  rows: number
  cols: number
  state: Matrix
  constructor(rows: number, cols: number) {
    this.rows = rows
    this.cols = cols
    this.state = new Matrix(rows, cols, EMPTY)
  }

  insert(pos: IPosition, entity: IEntity) {
    this.state.merge(entity.shape.asMatrix(), pos)
  }

  remove(pos: IPosition, entity: IEntity) {
    const shapeMatrix = entity.shape.asMatrix().fill(EMPTY)
    this.state.merge(shapeMatrix, pos)
  }

  renderBlock(ctx: CanvasRenderingContext2D, pos: IPosition, scale: number) {
    ctx.strokeStyle = 'black'
    ctx.strokeRect(pos.y * scale, pos.x * scale, scale, scale)
  }

  render(ctx: CanvasRenderingContext2D, scale: number) {
    this.state.data.forEach((row, x) => {
      row.forEach((_, y) => this.renderBlock.call(this, ctx, { x, y }, scale))
    })
  }
}
