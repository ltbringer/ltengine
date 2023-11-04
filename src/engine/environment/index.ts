import { Grid } from './grid'

export class Environment {
  m: number
  n: number
  grid: Grid
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  pxToCell: number

  constructor(
    m: number,
    n: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    pxToCell: number
  ) {
    this.m = m
    this.n = n
    this.grid = new Grid(m, n)
    this.canvas = canvas
    this.ctx = ctx
    this.pxToCell = pxToCell
  }

  render() {
    this.ctx.fillStyle = 'black'
    const width = this.m * this.pxToCell
    const height = this.n * this.pxToCell
    this.ctx.fillRect(0, 0, width, height)
  }
}
