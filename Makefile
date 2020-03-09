build:
	mkdir -p dist/public/assets
	cp -rf classes/ config/ partials/ public/ dist/
	cp -rf assets/css/master.css dist/public/assets
	rollup -f umd assets/js/main.js -o dist/public/assets/master.js

clean:
	rm -rf dist/*
