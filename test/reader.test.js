import {expect, test} from 'vitest'
import { read_str } from "../src/reader"
import { _symbol_Q } from "../src/types"
import {ns} from "../src/core"

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

test('READ_STR of lists', () => {
  expect(ns.count(read_str('(2 3)'))).toBe(2)
  expect(ns.first(read_str('(2 3)'))).toBe(2)
  expect(ns.first(ns.rest(read_str('(2 3)')))).toBe(3)
  const L = read_str('(+ 1 2 "str1" "string (with parens) and \'single quotes\'")');
  expect(ns.count(L)).toBe(5)
  expect(ns.nth(L, 3)).toBe('str1')
  expect(ns.nth(L, 4)).toBe('string (with parens) and \'single quotes\'')
  expect(read_str('(2 3)')).toStrictEqual([2,3])
  expect(read_str('(2 3 "string (with parens)")')).toStrictEqual([2,3, 'string (with parens)'])
})

test('READ_STR of quote/quasiquote', () => {
  expect(ns.nth(read_str('\'1'),0).value).toBe('quote')
  expect(ns.nth(read_str('\'1'),1)).toBe(1)
  expect(ns.nth(read_str('\'(1 2 3)'),0).value).toBe('quote')
  expect(ns.nth(ns.nth(read_str('\'(1 2 3)'),1),2)).toBe(3)
  expect(ns.nth(read_str('`1'),0).value).toBe('quasiquote')
  expect(ns.nth(read_str('`1'),1)).toBe(1)
  expect(ns.nth(read_str('`(1 2 3)'),0).value).toBe('quasiquote')
  expect(ns.nth(ns.nth(read_str('`(1 2 3)'),1),2)).toBe(3)
  expect(ns.nth(read_str('~1'),0).value).toBe('unquote')
  expect(ns.nth(read_str('~1'),1)).toBe(1)
  expect(ns.nth(read_str('~(1 2 3)'),0).value).toBe('unquote')
  expect(ns.nth(ns.nth(read_str('~(1 2 3)'),1),2)).toBe(3)
  expect(ns.nth(read_str('~@1'),0).value).toBe('splice-unquote')
  expect(ns.nth(read_str('~@1'),1)).toBe(1)
  expect(ns.nth(read_str('~@(1 2 3)'),0).value).toBe('splice-unquote')
  expect(ns.nth(ns.nth(read_str('~@(1 2 3)'),1),2)).toBe(3)
})