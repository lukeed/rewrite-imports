const fs = require('fs');
const mkdir = require('mk-dirs');
const { transform } = require('buble');
const pkg = require('./package');

let data = fs.readFileSync('src/index.js', 'utf8');

mkdir('dist').then(() => {
	// Copy as is for "main"
	fs.writeFileSync(pkg.main, data);

	// Transform to ES5 for "browser";
	let { code } = transform(data);
	fs.writeFileSync(pkg.browser, code);
});
