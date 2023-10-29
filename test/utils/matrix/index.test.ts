import { matrix } from '../../../src/utils/matrix'


describe('matrix', () => {
  it('should create a matrix of zeros', () => {
    const dims = 3
    const expected = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    const actual = matrix.fill(dims, 0)
    expect(actual).toEqual(expected)
  })

  it('should create a 2D matrix of ones', () => {
    const dims = 2
    const expected = [[1, 1], [1, 1]]
    const actual = matrix.fill(dims, 1)
    expect(actual).toEqual(expected)
  })
})
