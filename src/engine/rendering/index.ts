import { Entity } from "../entity"

export class RenderEngine {
    dims: number
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    resolution: number

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dims: number, resolution: number = 20) {
        this.dims = dims
        this.canvas = canvas
        this.ctx = ctx
        // 1 cell in the map is 5 pixel on the canvas.
        this.resolution = resolution
        this.canvas?.setAttribute('width', `${dims * resolution}px`)
        this.canvas?.setAttribute('height', `${dims * resolution}px`)
    }

    clear() {
        this.ctx.clearRect(0, 0, this.dims * this.resolution, this.dims * this.resolution)
    }

    renderEntity(entities: Entity[]) {
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
