import { matrix } from '@/src/utils/matrix'

export class Coordinates {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

export class Environment {
    dims: number;
    map: number[][];
    constructor(dims: number) {
        this.dims = dims
        this.map = matrix.zeros(dims)
    }
}
