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
        return env
}

export function addToEnv(env, key, val) {
    env.data[key] = val
    return val
}

export function getKeyInEnv(env, key) {
    return env.data[key]
}

export function newScope(env) {
    return {
        data: {},
        outer: env
    }
}