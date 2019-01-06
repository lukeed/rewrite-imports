'use strict';

const UNNAMED = /import\s*['"]([^'"]+)['"];?/gi;
const NAMED = /import\s*(\*\s*as)?\s*(\w*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi;

function destruct(keys, target) {
	let tmp, out=[];
	while (keys.length) {
		tmp = keys.shift().trim().split(' as ');
		out.push(tmp.join(':'));
	}
	return `const { ${ out.join(', ')} } = ${target};`;
}

function generate(keys, dep, base, fn) {
	dep = `${fn}('${dep}')`;

	if (keys.length && !base) {
		return destruct(keys, dep);
	}

	let out = `const ${base} = ${dep};`;

	if (keys.length) {
		out += '\n' + destruct(keys, base);
	}

	return out;
}

module.exports = function (str, fn) {
	fn = fn || 'require';
	return str
		.replace(NAMED, (_, asterisk, base, req, dep) => generate(req ? req.split(',') : [], dep, base, fn))
		.replace(UNNAMED, (_, dep) => `${fn}('${dep}');`);
}
