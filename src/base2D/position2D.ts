export interface IPosition2D {
    x: number;
    y: number;
}

export class Position2D implements IPosition2D {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    asString(): string {
        return `position=(${this.x}, ${this.y})`
    }
}
