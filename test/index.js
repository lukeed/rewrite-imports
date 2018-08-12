const test = require('tape');
const fn = require('../src');

// Single quotes

test(`import foo from 'foo'`, t => {
	t.is(fn(`import foo from 'foo'`), `const foo = require('foo');`);
	t.end();
});

test(`import foo from 'foo';`, t => {
	t.is(fn(`import foo from 'foo';`), `const foo = require('foo');`);
	t.end();
});

test(`import foo from './foo'`, t => {
	t.is(fn(`import foo from './foo'`), `const foo = require('./foo');`);
	t.end();
});

test(`import foo from '../foo/bar'`, t => {
	t.is(fn(`import foo from '../foo/bar'`), `const foo = require('../foo/bar');`);
	t.end();
});

test(`import foo from '../foo/bar';`, t => {
	t.is(fn(`import foo from '../foo/bar';`), `const foo = require('../foo/bar');`);
	t.end();
});

// Double quotes

test(`import foo from "foo"`, t => {
	t.is(fn(`import foo from "foo"`), `const foo = require('foo');`);
	t.end();
});

test(`import foo from "foo";`, t => {
	t.is(fn(`import foo from "foo";`), `const foo = require('foo');`);
	t.end();
});

test(`import foo from "./foo"`, t => {
	t.is(fn(`import foo from "./foo"`), `const foo = require('./foo');`);
	t.end();
});

test(`import foo from "../foo/bar"`, t => {
	t.is(fn(`import foo from "../foo/bar"`), `const foo = require('../foo/bar');`);
	t.end();
});

test(`import foo from "../foo/bar";`, t => {
	t.is(fn(`import foo from "../foo/bar";`), `const foo = require('../foo/bar');`);
	t.end();
});

// Partial Imports

test(`import { foo, bar } from 'baz'`, t => {
	const out = `const baz$1 = require('baz');\nconst foo = baz$1.foo;\nconst bar = baz$1.bar;`;
	t.is(fn(`import { foo, bar } from 'baz'`), out);
	t.end();
});

test(`import { foo, bar } from '../baz'`, t => {
	const out = `const baz$1 = require('../baz');\nconst foo = baz$1.foo;\nconst bar = baz$1.bar;`
	t.is(fn(`import { foo, bar } from '../baz'`), out);
	t.end();
});

// Mixed Imports

test(`import baz, { foo, bar } from 'baz'`, t => {
	const out = `const baz = require('baz');\nconst foo = baz.foo;\nconst bar = baz.bar;`;
	t.is(fn(`import baz, { foo, bar } from 'baz'`), out);
	t.end();
});

test(`import baz, { foo, bar } from '../baz'`, t => {
	const out = `const baz = require('../baz');\nconst foo = baz.foo;\nconst bar = baz.bar;`;
	t.is(fn(`import baz, { foo, bar } from '../baz'`), out);
	t.end();
});

test(`import baz, { foo } from 'baz';import bat, { foo as bar } from 'bat';`, t => {
	const out = `const baz = require('baz');\nconst foo = baz.foo;const bat = require('bat');\nconst bar = bat.foo;`;
	t.is(fn(`import baz, { foo } from 'baz';import bat, { foo as bar } from 'bat';`), out);
	t.end();
});

test(`import baz, { foo as bar, bar as bat } from 'baz'`, t => {
	const out = `const baz = require('baz');\nconst bar = baz.foo;\nconst bat = baz.bar;`;
	t.is(fn(`import baz, { foo as bar, bar as bat } from 'baz'`), out);
	t.end();
});

test(`import baz,{foo as bar} from 'baz';import quz,{foo as bat}from'quz';`, t => {
	const out = `const baz = require('baz');\nconst bar = baz.foo;const quz = require('quz');\nconst bat = quz.foo;`;
	t.is(fn(`import baz,{foo as bar} from 'baz';import quz,{foo as bat}from'quz';`), out);
	t.end();
});

// No spaces

test(`import'foo'`, t => {
	t.is(fn(`import'foo'`), `require('foo');`);
	t.end();
});

test(`import foo from'foo'`, t => {
	t.is(fn(`import foo from'foo'`), `const foo = require('foo');`);
	t.end();
});

test(`import{foo,bar}from'baz'`, t => {
	const out = `const baz$1 = require('baz');\nconst foo = baz$1.foo;\nconst bar = baz$1.bar;`;
	t.is(fn(`import{foo,bar}from'baz'`), out);
	t.end();
});

test(`import{foo,bar}from'../baz'`, t => {
	const out = `const baz$1 = require('../baz');\nconst foo = baz$1.foo;\nconst bar = baz$1.bar;`
	t.is(fn(`import{foo,bar}from'../baz'`), out);
	t.end();
});

// Dashes

test(`import foo from "foo-bar"`, t => {
	t.is(fn(`import foo from "foo-bar"`), `const foo = require('foo-bar');`);
	t.end();
});

test(`import {foo, bar} from 'foo-bar'`, t => {
	const out = `const foo_bar$1 = require('foo-bar');\nconst foo = foo_bar$1.foo;\nconst bar = foo_bar$1.bar;`
	t.is(fn(`import {foo, bar} from 'foo-bar'`), out);
	t.end();
});

// Aliases

test(`import { default as main } from 'foo'`, t => {
	t.is(fn(`import { default as main } from 'foo'`), `const foo$1 = require('foo');\nconst main = foo$1.default;`);
	t.end();
});

test(`import { foo as bar } from 'baz'`, t => {
	t.is(fn(`import { foo as bar } from 'baz'`), `const baz$1 = require('baz');\nconst bar = baz$1.foo;`);
	t.end();
});

test(`import { bar, default as main } from '../foo'`, t => {
	const out = `const foo$1 = require('../foo');\nconst bar = foo$1.bar;\nconst main = foo$1.default;`
	t.is(fn(`import { bar, default as main } from '../foo'`), out);
	t.end();
});

test(`import { foo as bar, default as main } from '../foo'`, t => {
	const out = `const foo$1 = require('../foo');\nconst bar = foo$1.foo;\nconst main = foo$1.default;`
	t.is(fn(`import { foo as bar, default as main } from '../foo'`), out);
	t.end();
});

test(`import {foo as bar, default as main} from '../foo'`, t => {
	const out = `const foo$1 = require('../foo');\nconst bar = foo$1.foo;\nconst main = foo$1.default;`
	t.is(fn(`import {foo as bar, default as main} from '../foo'`), out);
	t.end();
});

test(`import * as foo from '../foo'`, t => {
	const out = `const foo = require('../foo');`
	t.is(fn(`import * as foo from '../foo'`), out);
	t.end();
});

// Raw imports

test(`import 'bar'`, t => {
	t.is(fn(`import 'bar'`), `require('bar');`);
	t.end();
});

test(`import './foo';`, t => {
	t.is(fn(`import './foo';`), `require('./foo');`);
	t.end();
});


// Multi-line

test(`multi-line -- named`, t => {
	const str = `import {
		foo,
		bar,
		bat as baz
	} from 'baz'`;
	const out = `const baz$1 = require('baz');\nconst foo = baz$1.foo;\nconst bar = baz$1.bar;\nconst baz = baz$1.bat;`;
	t.is(fn(str), out);
	t.end();
});

test(`multi-line -- relative`, t => {
	const str = `import {
		foo,
		bar,
		bat as baz
	} from '../baz'`;
	const out = `const baz$1 = require('../baz');\nconst foo = baz$1.foo;\nconst bar = baz$1.bar;\nconst baz = baz$1.bat;`
	t.is(fn(str), out);
	t.end();
});

// Muiltiple statements

test(`import foo from 'foo';import bar from 'bar';`, t => {
	t.is(fn(`import foo from 'foo';import bar from 'bar';`), `const foo = require('foo');const bar = require('bar');`);
	t.end();
});

test(`import foo from 'foo'\\nimport { baz1, baz2 } from 'baz'`, t => {
	t.is(fn(`import foo from 'foo'\nimport { baz1, baz2 } from 'baz'`), `const foo = require('foo');\nconst baz$1 = require('baz');\nconst baz1 = baz$1.baz1;\nconst baz2 = baz$1.baz2;`);
	t.end();
});

test(`import 'bar';import './foo';`, t => {
	t.is(fn(`import 'bar';import './foo';`), `require('bar');require('./foo');`);
	t.end();
});

test(`import './foo'\\nimport 'bar'`, t => {
	t.is(fn(`import './foo'\nimport 'bar'`), `require('./foo');\nrequire('bar');`);
	t.end();
});
