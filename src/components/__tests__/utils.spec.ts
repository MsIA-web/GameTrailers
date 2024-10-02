import { expect, it, test, describe } from 'vitest'
import { findPageById, encodedTitle, filterByWordStart } from '@/utils/utils'

describe('findPageById', () => {
  it('should return the result as an integer rounded down.', () => {
    expect(findPageById(6)).toBe(2)
  })

  it('should return 1 for ids less than or equal to 5', () => {
    expect(findPageById(1)).toBe(1)
  })
})
