# clojurejs

Clojure interpreter in modern JavaScript (ESM)

Live demo: https://bobbicodes.github.io/clojurejs/

## Rationale

Eventually this will become a Codemirror extension similar to [lang-clojure-eval](https://github.com/bobbicodes/lang-clojure-eval/) but much lighter weight because it removes the Clojurescript dependency. The goal is very narrow because it's just meant for powering teaching tools, not writing actual software.

## Features

No macros yet, but some common Clojure macros are being implemented as special forms.

- ✅ Tail call optimization
- ✅ Immutable collections and swappable atoms like Clojure
- ✅ JavaScript interop
- ✅ Thread-first (`->`)
- ✅ Thread-last (`->>`)
- ✅ Anonymous function shorthand eg. `#(inc %)`

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
