export const init_env = {
    data: {},
    outer: null
}

export function bindExprs(outer, binds, exprs) {
    // Returns a new Env with symbols in binds bound to
    // corresponding values in exprs
    let env = init_env
        for (var i=0; i<binds.length;i++) {
            if (binds[i].value === "&") {
                // variable length arguments
                env.data[binds[i+1].value] = Array.prototype.slice.call(exprs, i);
                break;
            } else {
                env.data[binds[i].value] = exprs[i];
            }
        }
        env.outer = outer
        return env
}

export function addToEnv(env, key, val) {
    env.data[key] = val
    return val
}

export function findKeyInEnv(env, key) {
    if (env.data[key]) {
        return env.data
    } else if (env.outer) {
        return findKeyInEnv(env.outer, key)
    }
    return null
}

export function getKeyInEnv(env, key) {
    let _env = findKeyInEnv(env, key)
    return _env.data[key.value]
}

export function setInEnv(env, key, value) {
    env.data[key.value] = value
    return value
}

export function newScope(env) {
    return {
        data: {},
        outer: env
    }
}