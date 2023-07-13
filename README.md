# clojurejs

A simplistic Clojure interpreter written in JavaScript, for running Clojure in the browser or in node.

This is only an experiment in parsing and evaluating a LISP in JavaScript, i.e. it is not intended to be complete in any way.

The current goal of the project is to implement the features listed in the [Clojure Cheat Sheet](http://clojure.org/cheatsheet) that makes sense running in a browser.

### Getting Started

Only a few, simple steps is required:

    git clone git://github.com/gnab/clojurejs.git
    cd clojurejs
    make

Also, you need node (and npm) installed on your system.

A REPL is provided by running the repl script in the root dir.
For running the clojurejs REPL using Emacs' inferior lisp mode, type the following:

    C-u M-x inferior-lisp followed by /path/to/clojurejs/repl




