build:
	mkdir -p dist/local dist/public/js
	cp -rf src/* config/* dist/local
	cp -rf public  dist/
	cp -rf assets/css dist/public
	cp -rf assets/js dist/public
	rollup -f umd assets/js/master.js -o dist/public/js/main.js

clean:
	rm -rf dist/*
