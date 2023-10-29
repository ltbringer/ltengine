export const matrix = {
    zeros(dims: number): number[][] {
        return Array(dims).fill(0).map(() => Array(dims).fill(0))
    }
}