import { Grid } from './grid'

enum Mode {
  GAME = 'game',
  EDIT = 'edit'
}

const posAsKey = (pos: IPosition) => `${pos.x},${pos.y}`

export class Environment {
  m: number
  n: number
  grid: Grid
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  scale: number
  mode: Mode
  ids: Set<number>
  idMap: Map<number, Obj>
  posMap: Map<string, Obj>
  objects: Obj[]
  activeCMD: Set<string>

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
    this.ids = new Set()
    this.idMap = new Map()
    this.posMap = new Map()
    this.objects = []
    this.activeCMD = new Set()
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.canvas.addEventListener('click', this.handleClick.bind(this))
  }

  getId() {
    const id = this.ids.size + 1
    this.ids.add(id)
    return id
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyE':
      case 'KeyG':
      case 'KeyS':
      case 'KeyL':
      case 'ShiftLeft':
      case 'AltLeft':
        this.activeCMD.add(e.code)
        break;
      default:
        this.activeCMD.clear()
        break;
    }

    if (this.activeCMD.has('AltLeft') && this.activeCMD.has('ShiftLeft')) {
      if (this.activeCMD.has('KeyE')) {
        this.activeCMD.clear()
        this.mode = Mode.EDIT
      } else if (this.activeCMD.has('KeyG')) {
        this.activeCMD.clear()
        this.mode = Mode.GAME
      } else if (this.activeCMD.has('KeyS')) {
        this.activeCMD.clear()
        this.mode = Mode.GAME
        this.saveGameState()
      } else if (this.activeCMD.has('KeyL')) {
        this.activeCMD.clear()
        this.mode = Mode.GAME
        this.loadGameState()
      }
    }
  }
  registerEntity(obj: Obj) {
    this.grid.insert(obj.position, obj)
    this.idMap.set(obj.id, obj)
    this.posMap.set(posAsKey(obj.position), obj)
    this.objects.push(obj)
  }

  unregisterEntity(obj: Obj) {
    this.grid.remove(obj.position, obj)
    this.idMap.delete(obj.id)
    this.posMap.delete(posAsKey(obj.position))
    this.objects = this.objects.filter((e) => e.id !== obj.id)
  }

  createEntity(x: number, y: number) {
    const width = 1
    const height = 1
    const id = this.getId()
    const obj = new Obj({
      id,
      groupIds: [1],
      position: { x, y },
      width,
      height,
      shape: new Rectangle(width, height, id),
      collisionEffect: CollisionEffects.BLOCK,
    }, this)
    this.registerEntity(obj)
  }

  boundsCheck(pos: IPosition): boolean {
    const underM = pos.x >= 0
    const underN = pos.y >= 0
    const exceedsM = pos.x < this.m
    const exceedsN = pos.y < this.n
    return (underM && underN && exceedsM && exceedsN)
  }

  handleClick(e: MouseEvent) {
    const x = Math.floor(e.offsetX / this.scale)
    const y = Math.floor(e.offsetY / this.scale)

    const editMode = this.mode === Mode.EDIT
    const existingEntity = this.posMap.get(posAsKey({ x, y }))

    if (!this.boundsCheck({ x, y })) {
      return
    }

    if (editMode && existingEntity) {
      this.unregisterEntity(existingEntity)
    } else if (editMode && !existingEntity) {
      this.createEntity(x, y)
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
      this.ctx.fillText(`Mode: ${this.mode}`, this.canvas.width - 100, 40)
      this.grid.render(this.ctx, this.scale)
      for (const object of this.objects) {
        object.render(this.ctx, this.scale)
      }
      requestAnimationFrame(renderLoop)
    }
    renderLoop()
  }
}
