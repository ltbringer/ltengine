import { Matrix } from '../utils/matrix'

export interface IRectangle {
  width: number
  height: number
  value: number
}

export class Rectangle implements IRectangle {
  width: number
  height: number
  value: number
  constructor(width: number, height: number, value: number) {
    this.width = width
    this.height = height
    this.value = value
  }

  asMatrix(): Matrix {
    return new Matrix(this.height, this.width, this.value)
  }
}
