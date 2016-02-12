.PHONY: dist

build: dist_dir
	./node_modules/.bin/webpack

less: dist_dir
	./node_modules/.bin/lessc ./styles/main.less > ./dist/style.css

copy: dist_dir
	cp ./images/favicon.ico dist/

uglify:
	cat ./dist/bundle.js | ./node_modules/.bin/uglifyjs --compress -o ./dist/bundle.min.js
	du -ha ./dist/bundle.js
	du -ha ./dist/bundle.min.js

watch: dist_dir
	./node_modules/.bin/webpack -w

clean:
	rm -rf dist

dist_dir:
	mkdir -p dist

dist: build less copy uglify
