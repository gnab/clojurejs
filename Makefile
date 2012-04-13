all: deps test

deps:
	npm install

test:
	find test -name *_test.js | xargs ./node_modules/.bin/mocha

auto:
	find test -name *_test.js | xargs ./node_modules/.bin/mocha -w

.PHONY: deps test auto
