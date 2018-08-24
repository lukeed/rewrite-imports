'use strict';

const UNNAMED = /import\s*['"]([^'"]+)['"];?/gi;
const NAMED = /import\s*(\*\s*as)?\s*(\w*?)\s*,?\s*(?:\{([\s\S]*?)\})?\s*from\s*['"]([^'"]+)['"];?/gi;
const interop = `function ri$interop(m){return m.default||m}\n`;

function alias(key) {
	key = key.trim();
	let name = key.split(' as ');
	(name.length > 1) && (key=name.shift());
	return { key, name: name[0] };
}

function generate(keys, dep, base) {
	let tmp = base || (dep.split('/').pop().replace(/\W/g, '_') + '$' + num++); // uniqueness
	let name = base || alias(tmp).name;

	let obj, out='';
	if (base && !hasInterop) {
		hasInterop = true;
		out += interop;
	}

	dep = `require('${dep}')`;
	out += `const ${name} = ` + (base ? `ri$interop(${dep})` : dep) + ';';

	keys.forEach(key => {
		obj = alias(key);
		out += `\nconst ${obj.name} = ${tmp}.${obj.key};`;
	});

	return out;
}

let num, hasInterop;
module.exports = function (str) {
	num = hasInterop = 0;
	return str
		.replace(NAMED, (_, asterisk, base, req, dep) => generate(req ? req.split(',') : [], dep, base))
		.replace(UNNAMED, (_, dep) => `require('${dep}');`);
}
