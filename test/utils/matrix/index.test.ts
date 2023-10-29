import { matrix } from '@/src/utils/matrix' // @ts-ignore: Cannot find module


describe('matrix', () => {
  it('should create a matrix of zeros', () => {
    const dims = 3
    const expected = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    const actual = matrix.zeros(dims)
    expect(actual).toEqual(expected)
  })
})
