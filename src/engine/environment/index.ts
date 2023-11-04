import { Grid } from './grid';

export class Environment2D {
    m: number;
    n: number;
    grid: Grid;
    constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        this.grid = new Grid(m, n);
    }
}
