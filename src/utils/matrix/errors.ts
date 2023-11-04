export class MatrixOverflow extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, MatrixOverflow.prototype)
        this.name = "MergeError";
    }
}
