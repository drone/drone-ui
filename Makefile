.PHONY: dist

all: deps copy build

deps:
	npm install

build: dist_dir copy
	./node_modules/.bin/webpack

watch: dist_dir copy
	./node_modules/.bin/webpack -w

copy: dist_dir
	cp ./images/favicon.ico dist/

dist_dir:
	mkdir -p dist

lint:
	./node_modules/.bin/eslint src/

clean:
	rm -rf dist
