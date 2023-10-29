export const matrix = {
    fill(dims: number, value: number): number[][] {
        return Array(dims).fill(0).map(() => Array(dims).fill(value))
    }
}
