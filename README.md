# clojurejs

Clojure interpreter in modern JavaScript (ESM)

Live demo: https://bobbicodes.github.io/clojurejs/

## Rationale

Eventually this will become a Codemirror extension similar to [lang-clojure-eval](https://github.com/bobbicodes/lang-clojure-eval/) but much lighter weight because it removes the Clojurescript dependency.

## Status

Some things work. Others don't. `let` doesn't work, probably because of a bug in the env. Anonymous functions are doing something weird, eg. `((fn [n] (+ n 2)) 1) => "12"`. Instead of adding the numbers, it concatenates them, although regular arithmetic works, even with nested expressions. There are no namespaces, but I don't care (for now) because this is only meant to deal with a single namespace. I'll probably just define `ns` as a no-op. Macros are not yet implemented.

JavaScript interop works. Atoms work. We have map, apply, if, conj, first, rest etc.

## Dev

```
npm install
npm run dev
```

## Build

```
npm run build
npm run preview
```

## Credits

Borrows heavily from these two implementations, but simplified and updated to work with modern JavaScript tooling.

- [Mal (Make A Lisp)](https://github.com/kanaka/mal)
- [clojurejs](https://github.com/gnab/clojurejs)
