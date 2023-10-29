export class RenderEngine {
    ctx: CanvasRenderingContext2D | null;
    canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
}
