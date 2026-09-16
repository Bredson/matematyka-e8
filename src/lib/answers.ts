// Exact rational comparison, without eval or floating-point rounding.
function rational(input: string): [bigint, bigint] | null {
  const value = input.trim().replace(/−/g, '-').replace(/,/g, '.')
  if (value.length > 80) return null
  const fraction = /^([+-]?\d{1,12})\s*\/\s*([+-]?\d{1,12})$/.exec(value)
  if (fraction) {
    const denominator = BigInt(fraction[2])
    return denominator === 0n ? null : [BigInt(fraction[1]), denominator]
  }
  if (!/^[+-]?\d{1,12}(\.\d{1,9})?$/.test(value)) return null
  const [whole, decimal = ''] = value.split('.')
  const sign = value.startsWith('-') ? -1n : 1n
  const denominator = 10n ** BigInt(decimal.length)
  return [BigInt(whole) * denominator + sign * BigInt(decimal || '0'), denominator]
}

export function checkAnswer(input: string, expected: string): 'correct' | 'incorrect' | 'invalid' {
  const actual = rational(input)
  const target = rational(expected)
  if (!target) throw new Error('Invalid answer in task content')
  if (!actual) return 'invalid'
  return actual[0] * target[1] === target[0] * actual[1] ? 'correct' : 'incorrect'
}
