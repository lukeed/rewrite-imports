'use strict';

const isPartial = /[{}]/gi;

function basename(path) {
	return path.split('/').pop();
}

function clean(str, val) {
	return str.replace(val, '');
}

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
	const tmp = basename(clean(dep, /['"]/gi)).concat('$1'); // uniqueness
	let out=single(tmp, dep), obj;
	clean(keys, isPartial).split(',').forEach(function(key) {
		obj = alias(key);
		out += `\nconst ${obj.name} = ${tmp}.${obj.key};`;
	});
	return out;
}

module.exports = function (str) {
	return str.replace(/import (.*) from (.*)/gi, function(_, req, dep) {
		dep = clean(dep, ';');
		return isPartial.test(req) ? multi(req, dep) : single(req, dep);
	}).replace(/import (.*)/gi, function(_, dep) { return `require(${clean(dep, ';')});`});
}
