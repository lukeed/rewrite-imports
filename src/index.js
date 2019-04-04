'use strict';

var UNNAMED = /import\s*['"]([^'"]+)['"];?/gi;
var NAMED = /import\s*(\*\s*as)?\s*(\w*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi;

function destruct(keys, target) {
	var out=[];
	while (keys.length) out.push(keys.shift().trim().replace(/ as /g, ':'));
	return 'const { ' + out.join(', ') + ' } = ' + target + ';';
}

function generate(keys, dep, base, fn) {
	dep = fn + "('" + dep + "')";
	if (keys.length && !base) return destruct(keys, dep);
	return 'const ' + base + ' = ' + dep + ';' + (keys.length ? '\n' + destruct(keys, base) : '');
}

export default function (str, fn) {
	fn = fn || 'require';
	return str
		.replace(NAMED, function (x, asterisk, base, req, dep) {
			return generate(req ? req.split(',') : [], dep, base, fn);
		})
		.replace(UNNAMED, function (x, dep) {
			return (fn + "('" + dep + "');");
		});
}
