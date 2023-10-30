import { Entity } from "../entity"

export class RenderEngine {
    canvasId: string
    dims: number
    canvas: HTMLCanvasElement | null
    ctx: CanvasRenderingContext2D | null | undefined
    resolution: number

    constructor(canvasId: string, dims: number, resolution: number = 20) {
        this.canvasId = canvasId
        this.dims = dims;
        this.canvas = document.querySelector(this.canvasId)
        this.ctx = this.canvas?.getContext("2d")
        // 1 cell in the map is 5 pixel on the canvas.
        this.resolution = resolution
        this.canvas?.setAttribute('width', `${dims * resolution}px`)
        this.canvas?.setAttribute('height', `${dims * resolution}px`)
    }

    clear() {
        if (!this.ctx) {
            return
        }
        this.ctx.clearRect(0, 0, this.dims * this.resolution, this.dims * this.resolution)
    }

    renderEntity(entities: Entity[]) {
        if (!this.ctx) {
            return
        }
        for (let entity of entities) {
            if (entity.color) {
                this.ctx.fillStyle = entity.color
                this.ctx.fillRect(
                    entity.coordinates.x * this.resolution,
                    entity.coordinates.y * this.resolution,
                    entity.size.width * this.resolution,
                    entity.size.height * this.resolution
                )
            } else {
                const img = new Image()
                img.src = entity.img || ''
                this.ctx.drawImage(img,
                    entity.coordinates.x * this.resolution,
                    entity.coordinates.y * this.resolution,
                    entity.size.width * this.resolution,
                    entity.size.height * this.resolution
                )
            }
        }
    }

    renderMap(map: number[][]) {
        if (!this.ctx) {
            return
        }
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map.length; col++) {
                this.ctx.strokeStyle = map[row][col] === 0 ? '#444' : '#000'
                this.ctx.strokeRect(row * this.resolution, col * this.resolution, this.resolution, this.resolution)
            }
        }
    }

    render(map: number[][], entities: Entity[], debug: boolean = false) {
        this.clear();
        if (debug) {
            this.renderMap(map)
        }
        this.renderEntity(entities)
    }
}
