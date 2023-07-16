# clojurejs

Clojure interpreter in JavaScript

Live demo: https://bobbicodes.github.io/clojurejs/

## Rationale

Eventually this will become a Codemirror extension similar to [lang-clojure-eval](https://github.com/bobbicodes/lang-clojure-eval/) but much lighter weight because it removes the Clojurescript dependency.
I put it together from 2 other Lisp interpreters, the [mal (Make A Lisp)](https://github.com/kanaka/mal) project, and the upstream clojurejs repo. Neither completely worked for my purpose but they contained enough pieces between them to put this together. 

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