import { Position, IPosition } from '../../base/position'
import { MatrixOverflow } from './errors'

export class Matrix {
  m: number
  n: number
  data: number[][]
  constructor(m: number, n: number, value: number) {
    this.m = m
    this.n = n
    this.data = []
    this.fill(value)
  }

  shape(): string {
    return `shape=(${this.m}x${this.n})`
  }

  fill(value: number): Matrix {
    const v = Array(this.m)
      .fill(0)
      .map(() => Array(this.n).fill(value))
    this.data = v
    return this
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
        this.data[i_][j_] = m2.data[i][j]
      }
    }

    return this
  }
}
