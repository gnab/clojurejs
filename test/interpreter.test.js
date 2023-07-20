import { describe, expect, test, it } from 'vitest'
import { read_str } from "../src/reader"
import { _symbol_Q } from "../src/types"
import { } from "../src/core"

test('read of constants/strings', () => {
  expect(read_str('2')).toBe(2)
  expect(read_str('12345')).toBe(12345)
  expect(read_str('12345 "abc"')).toBe(12345)
  expect(read_str('"abc"')).toBe('abc')
  expect(read_str('"a string (with parens)"')).toBe('a string (with parens)')
})

test('read of symbols', () => {
  expect(_symbol_Q(read_str('abc'))).toBe(true)
  expect(read_str('abc').value).toBe('abc')
  expect(read_str('.').value).toBe('.')
})

test('READ_STR of strings', () => {
  expect(read_str('"a string"')).toBe('a string')
  expect(read_str('"a string (with parens)"')).toBe('a string (with parens)')
  expect(read_str('"a string"()')).toBe('a string')
  expect(read_str('"a string"123')).toBe('a string')
  expect(read_str('"a string"abc')).toBe('a string')
  expect(read_str('""')).toBe('')
  expect(read_str('"abc "')).toBe('abc ')
  expect(read_str('" abc"')).toBe(' abc')
  expect(read_str('"$abc"')).toBe('$abc')
  expect(read_str('"abc$()"')).toBe('abc$()')
  expect(read_str('"\\"xyz\\""')).toBe('"xyz"')
})