import { matrix } from '../../utils/matrix'
import { Actor } from '../actor'

export const WALKABLE = 0;

export class Coordinates {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

export class Environment {
    // This assumes a square environment.
    dims: number;
    // This is a 2D array of numbers, where each number represents an entity.
    map: number[][];
    actors: Actor[];

    constructor(dims: number, actors: Actor[]) {
        this.dims = dims
        // Default environment allows walking anywhere.
        this.map = matrix.fill(dims, WALKABLE)
        this.actors = actors
    }
}
