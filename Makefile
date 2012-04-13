all: deps test bundle

deps:
	npm install

test:
	find test -name *_test.js | xargs ./node_modules/.bin/mocha

autotest:
	find test -name *_test.js | xargs ./node_modules/.bin/mocha -w

bundle:
	node build/clojure.js

.PHONY: deps test autotest bundle
