import { Matrix } from '../../utils/matrix'
import { IPosition, Position } from '../../base/position'
import { Obj } from '../entity/object'

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

  insert(pos: IPosition, obj: Obj): boolean {
    const shapeMatrix = obj.shape.asMatrix()
    // check if there are non-empty cells in the state to be merged.
    for (let i = 0; i < shapeMatrix.m; i++) {
      for (let j = 0; j < shapeMatrix.n; j++) {
        const i_ = i + pos.x
        const j_ = j + pos.y
        const objStepsOnSomething = this.state.data[i_][j_] !== EMPTY
        const objStepsOnSelf = this.state.data[i_][j_] === obj.id

        if (objStepsOnSomething && !objStepsOnSelf && obj.rigidity > 0) {
          return false
        }
      }
    }
    this.state.merge(shapeMatrix, pos)
    return true
  }

  /**
   * A random EMPTY position in the grid
   */
  spawnPoint(): IPosition {
    const x = Math.floor(Math.random() * this.rows)
    const y = Math.floor(Math.random() * this.cols)
    console.log('spawning at', x, y)
    while (this.state.data[x][y] !== EMPTY) {
      return this.spawnPoint()
    }
    return { x, y }
  }

  remove(obj: Obj) {
    const shapeMatrix = obj.shape.asMatrix().fill(EMPTY)
    const pos = obj.position
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
