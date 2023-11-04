import { Matrix } from "../utils/matrix";

export class Rectangle {
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    asMatrix(value: number): Matrix {
        return new Matrix(this.height, this.width, value);
    }
}

export type Shape2D = Rectangle;