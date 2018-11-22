'use strict';

const UNNAMED = /import\s*['"]([^'"]+)['"];?/gi;
const NAMED = /import\s*(\*\s*as)?\s*(\w*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi;

function alias(key) {
	key = key.trim();
	let name = key.split(' as ');
	(name.length > 1) && (key=name.shift());
	return { key, name: name[0] };
}

function generate(keys, dep, base, fn) {
	const tmp = base || (dep.split('/').pop().replace(/\W/g, '_') + '$' + num++); // uniqueness
	const name = base || alias(tmp).name;

	dep = `${fn}('${dep}')`;

	let obj;
	let out = `const ${name} = ${dep};`;

	keys.forEach(key => {
		obj = alias(key);
		out += `\nconst ${obj.name} = ${tmp}.${obj.key};`;
	});

	return out;
}

let num;
module.exports = function (str, fn) {
	num = 0;
	fn = fn || 'require';
	return str
		.replace(NAMED, (_, asterisk, base, req, dep) => generate(req ? req.split(',') : [], dep, base, fn))
		.replace(UNNAMED, (_, dep) => `${fn}('${dep}');`);
}
