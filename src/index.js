'use strict';

const UNNAMED = /import\s*['"]([^'"]+)['"];?/gi;
const NAMED = /import\s*([^,{]*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi;

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
	base = base || dep.split('/').pop().replace(/\W/g, '_') + '$' + NAMED.num++; // uniqueness
	let obj, out = single(base, dep);
	keys.split(',').forEach(key => {
		obj = alias(key);
		out += `\nconst ${obj.name} = ${base}.${obj.key};`;
	});
	return out;
}

module.exports = function (str) {
	NAMED.num = 0;
	return str
		.replace(NAMED, (_, base, req, dep) => req ? multi(req, dep, base) : single(base, dep))
		.replace(UNNAMED, (_, dep) => `require('${dep}');`);
}
