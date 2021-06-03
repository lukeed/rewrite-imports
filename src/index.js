'use strict';

function destruct(keys, target) {
	var out=[];
	while (keys.length) out.push(keys.shift().trim().replace(/ as /g, ':'));
	return 'const { ' + out.join(', ') + ' } = ' + target;
}

function generate(keys, dep, base) {
	if (keys.length && !base) return destruct(keys, dep);
	return 'const ' + base + ' = ' + dep + (keys.length ? ';\n' + destruct(keys, base) : '');
}

export function rewrite(str, fn) {
	fn = fn || 'require';
	return str.replace(/(^|;\s*|\r?\n+)import\s*((?:\*\s*as)?\s*([a-z$_][\w$]*)?\s*,?\s*(?:{([\s\S]*?)})?)?\s*(from)?\s*(['"`][^'"`]+['"`])(?=;?)(?=([^"'`]*["'`][^"'`]*["'`])*[^"'`]*$)/gi, function (raw, ws, _, base, req, fro, dep) {
		dep = fn + '(' + dep + ')';
		return (ws||'') + (fro ? generate(req ? req.split(',') : [], dep, base) : dep);
	});
}
