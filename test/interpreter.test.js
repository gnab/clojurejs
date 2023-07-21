import {expect, test} from 'vitest'
import { read_str } from "../src/reader"
import { _symbol } from "../src/types"
import * as _env from '../src/env.js'
import { EVAL, _EVAL, eval_ast } from "../src/interpreter"

test('interpreter', () => {
  expect(EVAL(read_str('(let [x 2] x)')), _env.currentEnv).toBe(2)
  expect(EVAL(read_str('(let [x 1] x)')), _env.currentEnv).toBe(1)
  expect(_EVAL(read_str('(let [y 3] y)')), _env.currentEnv).toBe(3)
  //expect(_EVAL(read_str('{:a 1}')), _env.currentEnv).toBe(_symbol({a: 1}))
})