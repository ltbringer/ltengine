import { Grid2D } from './grid2D';

class Environment {
    m: number;
    n: number;
    grid: Grid2D;
    constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        this.grid = new Grid2D(m, n);
    }
}
