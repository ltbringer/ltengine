/**
 * @jest-environment jsdom
 */
import { Environment } from '../../../src/engine/environment'

describe('Environment', () => {
  it('should create unique ids for registered entities', () => {
    const env = new Environment({
      m: 3,
      n: 3,
      scale: 1,
    })
    const id1 = env.getId()
    const id2 = env.getId()
    expect(id1).not.toEqual(id2)
  })
})
