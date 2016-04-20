.PHONY: dist

all: deps copy build

deps:
	npm install

build: dist_dir copy
	./node_modules/.bin/webpack --optimize-minimize

watch: dist_dir copy
	./node_modules/.bin/webpack -w

copy: dist_dir
	cp -r ./images/* dist/

dist_dir:
	mkdir -p dist

lint:
	./node_modules/.bin/eslint src/

clean:
	rm -rf dist
