export class Rectangle {
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    asMatrix(value: number) {
        const matrix: number[][] = [];
        for (let i = 0; i < this.height; i++) {
            matrix.push([]);
            for (let j = 0; j < this.width; j++) {
                matrix[i].push(value);
            }
        }
        return matrix;
    }
}

export const Shapes = {
    Rectangle
}
