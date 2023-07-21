export const init_env = {
    data: {},
    outer: null
}

export let currentEnv = init_env

export function bindExprs(env, binds, exprs) {
    // Returns a new Env with symbols in binds bound to
    // corresponding values in exprs
    //let env = init_env
    for (var i = 0; i < binds.length; i++) {
        if (binds[i].value === "&") {
            // variable length arguments
            env.data[binds[i + 1].value] = Array.prototype.slice.call(exprs, i);
            break;
        } else {
            console.log("Binding", binds[i].value, "to", exprs[i])
            env.data[binds[i].value] = exprs[i];
        }
    }
    //env.outer = outer || null
    return env
}

export function addToEnv(env, key, val) {
    env.data[key.value] = val
    return val
}

export function findKeyInEnv(env, key) {
    //   console.log("env:", env)
    //   console.log("key:", key)
    //   console.log("key.value in env.data:", key.value in env.data)
    if (key in env.data) {
        return env
    } else if (env.outer && key in env.outer.data) {
        //     console.log("key in env.outer:", env.outer)
        return findKeyInEnv(env.outer, key)
    } else
        return null
}

export function getKeyInEnv(env, key) {
    // console.log("Attempting to get " + key + " in " + env)
    //console.log(findKeyInEnv(env, key))
    if (!findKeyInEnv(env, key)) {
        return "Error: " + key + " is undefined"
    }
    let _env = findKeyInEnv(env, key)
    return _env.data[key]
}

export function setInEnv(env, key, value) {
    console.log(key.value)
    console.log("setting", key, "in env", env)
    env.data[key.value] = value
    return value
}

export function newScope(env) {
    return {
        data: {},
        outer: env
    }
}