'use strict';

const basename = require('path').basename;

const isPartial = /[{}]/gi;

const clean = (str, val) => str.replace(val, '');

function alias(key) {
	key = key.trim();
	let name = key.split(' as ');
	(name.length > 1) && (key=name.shift());
	return { key, name:name[0] };
}

function single(key, dep) {
	const obj = alias(key);
	return `const ${obj.name} = require(${dep});`;
}

function multi(keys, dep) {
	const tmp = clean(basename(dep), /['"]/gi).concat('$1'); // uniqueness
	let out=single(tmp, dep), obj;
	clean(keys, isPartial).split(',').forEach(key => {
		obj = alias(key);
		out += `\nconst ${obj.name} = ${tmp}.${obj.key};`;
	});
	return out;
}

module.exports = function (str) {
	return str.replace(/import ([\s\S]*?) from (.*)/gi, (_, req, dep) => {
		dep = clean(dep, ';');
		return isPartial.test(req) ? multi(req, dep) : single(req, dep);
	}).replace(/import (.*)/gi, (_, dep) => `require(${clean(dep, ';')});`);
}
