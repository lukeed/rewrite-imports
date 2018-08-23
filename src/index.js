'use strict';

const UNNAMED = /import\s*['"]([^'"]+)['"];?/gi;
const NAMED = /import\s*(\*\s*as)?\s*(\w*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi;

function alias(key) {
	key = key.trim();
	let name = key.split(' as ');
	(name.length > 1) && (key=name.shift());
	return { key, name: name[0] };
}

function generate(keys, dep, base) {
	let obj, out = '',
		tmp = base || (dep.split('/').pop().replace(/\W/g, '_') + '$' + num++); // uniqueness

	if (base) {
		if (!hasInterop) {
			out = `function ri$interop(m) { return m.default || m }\n`;
			hasInterop = true;
		}
		out += `const ${base} = ri$interop(require('${dep}'));`;
	}
	else {
		out += `const ${alias(tmp).name} = require('${dep}');`;
	}

	keys.forEach(key => {
		obj = alias(key);
		out += `\nconst ${obj.name} = ${tmp}.${obj.key};`;
	});
	return out;
}

let num, hasInterop;
module.exports = function (str) {
	num = 0;
	hasInterop = false;
	return str
		.replace(NAMED, (_, asterisk, base, req, dep) => generate(req ? req.split(',') : [], dep, base))
		.replace(UNNAMED, (_, dep) => `require('${dep}');`);
}
