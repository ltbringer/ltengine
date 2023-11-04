import { Matrix } from "../../utils/matrix";
import { Position } from "../../base/position";
import { Shape } from "../../base/shape";


export const EMPTY = 0;

export class Grid {
    rows: number;
    cols: number;
    state: Matrix;
    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.state = new Matrix(rows, cols, EMPTY);
    }

    insert(pos: Position, shape: Shape) {

    }
}