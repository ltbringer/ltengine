import { Matrix } from '../../../src/utils/matrix'
import { MatrixOverflow } from '../../../src/utils/matrix/errors';


describe('matrix', () => {
  it.each([
    {
      rows: 3,
      cols: 3,
      value: 0,
      expected: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    },
    {
      rows: 2,
      cols: 2,
      value: 1,
      expected: [[1, 1], [1, 1]]
    },
  ])('should create a %i x %i matrix of %i values', ({ rows, cols, value, expected }) => {
    const result = new Matrix(rows, cols, value).state;
    expect(result).toEqual(expected);
  });
});

describe('matrix.merge', () => {
  it.each([
    {
      description: 'should merge a 3x3 matrix of 0 values into a 3x3 matrix of 1 values at (1, 1)',
      m1: { rows: 3, cols: 3, value: 0 },
      m2: { rows: 2, cols: 2, value: 1 },
      position: { x: 1, y: 1 },
      expected: [[0, 0, 0], [0, 1, 1], [0, 1, 1]],
    },
    {
      description: 'should merge a 3x3 matrix of 0 values into a 3x3 matrix of 1 values at (0, 0)',
      m1: { rows: 3, cols: 3, value: 0 },
      m2: { rows: 2, cols: 2, value: 1 },
      position: { x: 0, y: 0 },
      expected: [[1, 1, 0], [1, 1, 0], [0, 0, 0]],
    },
    {
      description: 'should throw MatrixOverflow when merging a 2x2 matrix of 1 values into a 3x3 matrix at (2, 2)',
      m1: { rows: 3, cols: 3, value: 0 },
      m2: { rows: 2, cols: 2, value: 1 },
      position: { x: 2, y: 2 },
      expectError: true,
    },
  ])('%s', ({ description, m1, m2, position, expected, expectError }) => {
    const m1_ = new Matrix(m1.rows, m1.cols, m1.value);
    const m2_ = new Matrix(m2.rows, m2.cols, m2.value);
    if (expectError) {
      expect(() => m1_.merge(m2_, position)).toThrow(MatrixOverflow);
    } else {
      const result = m1_.merge(m2_, position).state;
      expect(result).toEqual(expected);
    }
  });
});
