import { Grid } from './grid'
import { Obj } from '../entity/object'
import { CollisionEffects } from '../../base/entity';
import { IPosition, Position } from '../../base/position';
import { Actor } from '../entity/actor';

enum Mode {
  GAME = 'game',
  EDIT = 'edit',
}

enum Motion {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

const posAsKey = (pos: IPosition) => `${pos.x},${pos.y}`

export interface IEnvironment {
  m: number,
  n: number,
  canvas?: HTMLCanvasElement,
  ctx?: CanvasRenderingContext2D,
  scale: number
}

export class Environment {
  m: number
  n: number
  grid: Grid
  canvas?: HTMLCanvasElement
  ctx?: CanvasRenderingContext2D
  scale: number
  mode: Mode
  ids: Set<number>
  idMap: Map<number, Obj>
  posMap: Map<string, Obj>
  objects: Obj[]
  activeCMD: Set<string>
  mainActor?: Actor

  constructor(config: IEnvironment) {
    this.m = config.m
    this.n = config.n
    this.grid = new Grid(config.m, config.n)
    this.canvas = config.canvas
    this.ctx = config.ctx
    this.scale = config.scale
    this.mode = Mode.GAME
    this.ids = new Set()
    this.idMap = new Map()
    this.posMap = new Map()
    this.objects = []
    this.activeCMD = new Set()
    this.mainActor = undefined
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.canvas?.addEventListener('click', this.handleClick.bind(this))
  }

  getId() {
    const id = this.ids.size + 1
    this.ids.add(id)
    return id
  }

  registerActor(actor: Actor) {
    this.registerEntity(actor)
    this.mainActor = actor
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.motion(Motion.UP)
        break;

      case 'KeyA':
      case 'ArrowLeft':
        this.motion(Motion.LEFT)
        break;

      case 'KeyS':
      case 'ArrowDown':
        this.motion(Motion.DOWN)
        break;


      case 'KeyD':
      case 'ArrowRight':
        this.motion(Motion.RIGHT)
        break;

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
        this.save()
      } else if (this.activeCMD.has('KeyL')) {
        this.activeCMD.clear()
        this.mode = Mode.GAME
        this.load()
      }
    }
  }

  save() {
    localStorage.setItem('gamedata', JSON.stringify(
      this.objects.map((e) => ({
        id: e.id,
        groupIds: e.groupIds,
        position: e.position,
        width: e.width,
        height: e.height,
        shape: e.shape,
        collisionEffect: e.collisionEffect,
      }))
    ))
  }

  load() {
    console.log('retrieving game data')
    const gamedata = localStorage.getItem('gamedata')
    if (gamedata) {
      const gameobjects = JSON.parse(gamedata)
      for (const object of gameobjects) {
        const obj = new Obj(object, this)
        this.registerEntity(obj)
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
    this.grid.remove(obj)
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
      color: 'black',
      collisionEffect: CollisionEffects.BLOCK,
      rigidity: 1,
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

  update(obj: Obj, position: IPosition) {
    const underflow = position.x < 0 || position.y < 0
    const overflow = position.x + obj.width > this.grid.rows || position.y + obj.height > this.grid.cols

    if (underflow || overflow) {
      return
    }

    const newPosition = new Position(position.x, position.y)
    if (this.grid.insert(newPosition, obj)) {
      this.grid.remove(obj)
      obj.position = newPosition
    }
  }

  motion(direction: Motion) {
    if (!this.mainActor) {
      return
    }
    const actor = this.mainActor
    const { x, y } = actor.position
    const xSpeed = actor.speed.x
    const ySpeed = actor.speed.y
    let newPosition: IPosition;
    switch (direction) {
      case Motion.UP:
        newPosition = { x, y: y - ySpeed }
        break;
      case Motion.DOWN:
        newPosition = { x, y: y + ySpeed }
        break;
      case Motion.LEFT:
        newPosition = { x: x - xSpeed, y }
        break;
      case Motion.RIGHT:
        newPosition = { x: x + xSpeed, y }
        break;
    }
    this.update(actor, newPosition)
  }

  render() {
    let times: number[] = [];
    let fpsHist: number[] = [];
    let avgFPS = 0;
    let fps = 0;
    const renderLoop = () => {
      const ctx = this.ctx;
      const canvas = this.canvas;
      if (!ctx) {
        return
      }
      if (!canvas) {
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = performance.now()
      times = times.filter((timestamp) => timestamp >= now - 1000);
      times.push(now);
      fps = times.length;
      fpsHist.push(fps);
      if (fpsHist.length > 100) {
        avgFPS = fpsHist.reduce((a, b) => a + b, 0) / fpsHist.length;
        fpsHist = [];
      }

      ctx.fillStyle = 'black'
      ctx.fillText(`FPS: ${avgFPS.toFixed(1)}`, canvas.width - 100, 20)
      ctx.fillText(`Mode: ${this.mode}`, canvas.width - 100, 40)
      this.grid.render(ctx, this.scale)
      for (const object of this.objects) {
        object.render(ctx, this.scale)
      }
      requestAnimationFrame(renderLoop)
    }
    renderLoop()
  }
}
