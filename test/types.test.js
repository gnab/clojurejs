import { expect, test } from 'vitest'
import { ns } from '../src/core'
import { _symbol } from '../src/types'
import { init_env, setInEnv, getKeyInEnv } from '../src/env'

const hash_map = ns['hash-map']
const hash_map_Q = ns['map?']
const get = ns['get']
const contains_Q = ns['contains?']
const assoc = ns['assoc']
const dissoc = ns['dissoc']
const count = ns['count']
const equal_Q = ns['=']
const symbol = _symbol

test('hash_maps', () => {
    const X = hash_map()
    expect(hash_map_Q(X)).toBe(true)
    expect(get(X, 'a')).toBe(null)
    expect(contains_Q(X, 'a')).toBe(false)
    const X1 = assoc(X, 'a', "value of X a")
    expect(get(X, 'a')).toBe(null)
    expect(contains_Q(X, 'a')).toBe(false)
    expect(get(X1, 'a')).toBe("value of X a")
    expect(contains_Q(X1, 'a')).toBe(true)
    const Y = hash_map();
    expect(count(Y)).toBe(0)
    const Y1 = assoc(Y, 'a', "value of Y a")
    expect(count(Y1)).toBe(1)
    const Y2 = assoc(Y1, 'b', "value of Y b");
    expect(count(Y2)).toBe(2)
    expect(get(Y2, 'a')).toBe("value of Y a")
    expect(get(Y2, 'b')).toBe("value of Y b")
    const X2 = assoc(X1, 'b', Y2);
    expect(count(Y2)).toBe(2)
    expect(hash_map_Q(get(X2, 'b'))).toBe(true)
    expect(get(get(X2, 'b'), 'a')).toBe('value of Y a')
    expect(get(get(X2, 'b'), 'b')).toBe('value of Y b')
    const Y3 = dissoc(Y2, 'a');
    expect(count(Y2)).toBe(2)
    expect(count(Y3)).toBe(1)
    expect(get(Y3, 'a')).toBe(null)
    const Y4 = dissoc(Y3, 'b');
    expect(count(Y4)).toBe(0)
    expect(get(Y4, 'b')).toBe(null)
})

test('equal? function', () => {
    expect(equal_Q(2, 2)).toBe(true)
    expect(equal_Q(2, 3)).toBe(false)
    expect(equal_Q("abc", "abc")).toBe(true)
    expect(equal_Q("abc", "abz")).toBe(false)
    expect(equal_Q("zbc", "abc")).toBe(false)
    expect(equal_Q(symbol("abc"), symbol("abc"))).toBe(true)
    expect(equal_Q(symbol("abc"), symbol("abz"))).toBe(false)
    expect(equal_Q(symbol("zbc"), symbol("abc"))).toBe(false)
    const L6 = [1, 2, 3];
    const L7 = [1, 2, 3];
    const L8 = [1, 2, "Z"];
    const L9 = ["Z", 2, 3];
    const L10 = [1, 2];
    expect(equal_Q(L6, L7)).toBe(true)
    expect(equal_Q(L6, L8)).toBe(false)
    expect(equal_Q(L6, L9)).toBe(false)
    expect(equal_Q(L6, L10)).toBe(false)
    expect(equal_Q(L10, L6)).toBe(false)
})

test('ENV (1 level)', () => {
    let env1 = init_env
    expect(setInEnv(env1, 'a','val_a')).toBe('val_a')
    expect(setInEnv(env1, 'b','val_b')).toBe('val_b')
    expect(setInEnv(env1, '=','val_eq')).toBe('val_eq')
    expect(getKeyInEnv(env1, 'a')).toBe('val_a')
    expect(getKeyInEnv(env1, 'b')).toBe('val_b')
    expect(getKeyInEnv(env1, '=')).toBe('val_eq')
})