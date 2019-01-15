build:
	mkdir -p dist/local dist/public/js
	cp -rf src/* config/* dist/local
	cp -rf public  dist/
	cp -rf assets/css dist/public
	rollup -f umd assets/js/main.js -o dist/public/js/master.js

clean:
	rm -rf dist/*
