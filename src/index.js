'use strict';

const UNNAMED = /import\s*['"]([^'"]+)['"];?/gi;
const NAMED = /import\s*(\*\s*as)?\s*(\w*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi;

function alias(key) {
	key = key.trim();
	let name = key.split(' as ');
	(name.length > 1) && (key=name.shift());
	return { key, name:name[0] };
}

function single(key, dep) {
	return `const ${alias(key).name} = require('${dep}');`;
}

function multi(keys, dep, base) {
	let obj,
		tmp = (base || dep.split('/').pop().replace(/\W/g, '_')) + '$' + num++, // uniqueness
		out = single(tmp, dep);
	if (base) out += `\nconst ${base} = ${tmp}.default || ${tmp};`;
	keys.forEach(key => {
		obj = alias(key);
		out += `\nconst ${obj.name} = ${tmp}.${obj.key};`;
	});
	return out;
}

let num;
module.exports = function (str) {
	num = 0;
	return str
		.replace(NAMED, (_, asterisk, base, req, dep) => multi(req ? req.split(',') : [], dep, base))
		.replace(UNNAMED, (_, dep) => `require('${dep}');`);
}
