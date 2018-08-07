'use strict';

const basename = require('path').basename;

function alias(key) {
	key = key.trim();
	let name = key.split(' as ');
	(name.length > 1) && (key=name.shift());
	return { key, name:name[0] };
}

function single(key, dep) {
	const obj = alias(key);
	return `const ${obj.name} = require('${dep}');`;
}

function multi(keys, dep) {
	const tmp = basename(dep) + '$1'; // uniqueness
	let out = single(tmp, dep), obj;
	keys.split(',').forEach(key => {
		obj = alias(key);
		out += `\nconst ${obj.name} = ${tmp}.${obj.key};`;
	});
	return out;
}

module.exports = function (str) {
	return str
		.replace(/import (\{?)([\s\S]*?)\}? from ['"]([^'"]+)['"];?/gi, (_, bracket, req, dep) => {
			return bracket ? multi(req, dep) : single(req, dep);
		})
		.replace(/import ['"]([^'"]+)['"];?/gi, (_, dep) => `require('${dep}');`);
}
