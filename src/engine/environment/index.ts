import { Grid } from './grid'

enum Mode {
  GAME = 'game',
  EDIT = 'edit'
}

export class Environment {
  m: number
  n: number
  grid: Grid
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  scale: number
  mode: Mode

  constructor(
    m: number,
    n: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    scale: number
  ) {
    this.m = m
    this.n = n
    this.grid = new Grid(m, n)
    this.canvas = canvas
    this.ctx = ctx
    this.scale = scale
    this.mode = Mode.GAME
  getId() {
    const id = this.ids.size + 1
    this.ids.add(id)
    return id
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyE':
        this.mode = Mode.EDIT
        break;
      case 'KeyG':
        this.mode = Mode.GAME
        break;
      default:
        break;
    }
  }

  render() {
    let times: number[] = [];
    let fpsHist: number[] = [];
    let avgFPS = 0;
    let fps = 0;
    const renderLoop = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const now = performance.now()
      times = times.filter((timestamp) => timestamp >= now - 1000);
      times.push(now);
      fps = times.length;
      fpsHist.push(fps);
      if (fpsHist.length > 100) {
        avgFPS = fpsHist.reduce((a, b) => a + b, 0) / fpsHist.length;
        fpsHist = [];
      }
      this.ctx.fillText(`FPS: ${avgFPS.toFixed(1)}`, this.canvas.width - 100, 20)
      this.grid.render(this.ctx, this.scale)
      requestAnimationFrame(renderLoop)
    }
    renderLoop()
  }
}
