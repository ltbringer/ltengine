import { random } from '../../../src/utils/numbers'


describe('random', () => {
    it.each([
        [1, 10],
        [0, 100],
        [10, 20],
        [-5, 5],
    ])('should return a random number between %i and %i', (min, max) => {
        const result = random(min, max);
        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
    });
})
