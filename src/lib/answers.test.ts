import { describe, expect, it } from 'vitest'
import { checkAnswer } from './answers'

describe('equivalent numeric answers', () => {
  it.each(['1/2', '2/4', '4/8', '0,5', '0.500', ' +1 / 2 ', '-1/-2'])('accepts %s as one half', input => {
    expect(checkAnswer(input, '1/2')).toBe('correct')
  })
  it.each(['5', '5,00', '10/2', '+05.0'])('accepts money without requiring a particular notation: %s', input => {
    expect(checkAnswer(input, '5')).toBe('correct')
  })
  it('compares negative decimals exactly', () => {
    expect(checkAnswer('−0,5', '-1/2')).toBe('correct')
    expect(checkAnswer('-1.25', '-5/4')).toBe('correct')
    expect(checkAnswer('-1/2', '1/2')).toBe('incorrect')
  })
  it('does not mistake rounded answers for exact fractions', () => {
    expect(checkAnswer('0.666667', '2/3')).toBe('incorrect')
    expect(checkAnswer('8/12', '2/3')).toBe('correct')
    expect(checkAnswer('0.500000001', '1/2')).toBe('incorrect')
  })
  it.each(['', ' ', '1/0', '0/0', '2+3', '1 2', '1,2,3', '5 zł', 'Infinity', 'NaN', '1e3', '<script>', '9'.repeat(100)])('rejects malformed input %s', input => {
    expect(checkAnswer(input, '5')).toBe('invalid')
  })
  it('rejects an invalid author answer', () => {
    expect(() => checkAnswer('3', 'wrong')).toThrow()
  })
})
