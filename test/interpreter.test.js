import {describe, expect, test, it} from 'vitest'
import {read_str} from "../src/reader"
import {} from "../src/types"
import {} from "../src/core"

test('read of constants/strings', () => {
    expect(read_str('2')).toBe(2)
    expect(read_str('12345')).toBe(12345)
    expect(read_str('12345 "abc"')).toBe(12345)
    expect(read_str('"abc"')).toBe('abc')
    expect(read_str('"a string (with parens)"')).toBe('a string (with parens)')
  })
  