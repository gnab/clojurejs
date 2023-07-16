# clojurejs

Clojure interpreter in JavaScript

Live demo: https://bobbicodes.github.io/clojurejs/

## Status

I put this together from 2 other Lisp interpreters, the [mal (Make A Lisp)](https://github.com/kanaka/mal) project, and the upstream clojurejs repo. Neither completely worked for me but I ended up with something that sort of works. The goal is to write it in an extremely basic style that a beginning student can understand. No classes, no constructors, just functions and data. The longer term goal is to use it in a Codemirror extension similar to [lang-clojure-eval](https://github.com/bobbicodes/lang-clojure-eval/) but much lighter weight because it removes the Clojurescript dependency.

## Dev

npm install
npm run dev

## Build

npm run build