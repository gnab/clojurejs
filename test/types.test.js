import {expect, test} from 'vitest'
import { ns } from '../src/core'

const hash_map = ns['hash-map']
const hash_map_Q = ns['map?']
const get = ns['get']
const contains_Q = ns['contains?']
const assoc = ns['assoc']
const dissoc = ns['dissoc']
const count = ns['count']

test('hash_maps', () => {
    const X = hash_map()
    expect(hash_map_Q(X)).toBe(true)
    expect(get(X,'a')).toBe(null)
    expect(contains_Q(X, 'a')).toBe(false)
    const X1 = assoc(X, 'a', "value of X a")
    expect(get(X,'a')).toBe(null)
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
    expect(hash_map_Q(get(X2,'b'))).toBe(true)
    expect(get(get(X2,'b'),'a')).toBe('value of Y a')
    expect(get(get(X2,'b'),'b')).toBe('value of Y b')
    const Y3 = dissoc(Y2, 'a');
    expect(count(Y2)).toBe(2)
    expect(count(Y3)).toBe(1)
    expect(get(Y3, 'a')).toBe(null)
    const Y4 = dissoc(Y3, 'b');
    expect(count(Y4)).toBe(0)
    expect(get(Y4, 'b')).toBe(null)
  })