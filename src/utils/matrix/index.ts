import { Position, IPosition } from '../../base/position'
import { MatrixOverflow } from './errors'

export class Matrix {
  m: number
  n: number
  state: number[][]
  constructor(m: number, n: number, value: number) {
    this.m = m
    this.n = n
    this.state = this.fill(value)
  }

  shape(): string {
    return `shape=(${this.m}x${this.n})`
  }

  private fill(value: number): number[][] {
    return Array(this.m)
      .fill(0)
      .map(() => Array(this.n).fill(value))
  }

  merge(m2: Matrix, position: IPosition): Matrix {
    const pos = new Position(position.x, position.y)
    const exceedsM = m2.n > this.n
    const exceedsN = m2.m > this.m
    const exceedsPosX = position.x + m2.n > this.n
    const exceedsPosY = position.y + m2.m > this.m

    if (exceedsM || exceedsN) {
      throw new MatrixOverflow(
        `Cannot merge matrix ${m2.shape()} into matrix of ${this.shape()}`
      )
    }

    if (exceedsPosX || exceedsPosY) {
      throw new MatrixOverflow(`Cannot merge matrix with ${m2.shape()} into
            matrix of ${this.shape()} at ${pos.asString()}`)
    }

    for (let i = 0; i < m2.m; i++) {
      for (let j = 0; j < m2.n; j++) {
        const i_ = i + position.y
        const j_ = j + position.x
        this.state[i_][j_] = m2.state[i][j]
      }
    }

    return this
  }
}
