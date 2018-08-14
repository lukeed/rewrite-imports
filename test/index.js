const test = require('tape');
const fn = require('../src');

// Single quotes

test(`import foo from 'foo'`, t => {
	t.is(fn(`import foo from 'foo'`), `const foo$0 = require('foo');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import foo from 'foo';`, t => {
	t.is(fn(`import foo from 'foo';`), `const foo$0 = require('foo');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import foo from './foo'`, t => {
	t.is(fn(`import foo from './foo'`), `const foo$0 = require('./foo');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import foo from '../foo/bar'`, t => {
	t.is(fn(`import foo from '../foo/bar'`), `const foo$0 = require('../foo/bar');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import foo from '../foo/bar';`, t => {
	t.is(fn(`import foo from '../foo/bar';`), `const foo$0 = require('../foo/bar');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

// Double quotes

test(`import foo from "foo"`, t => {
	t.is(fn(`import foo from "foo"`), `const foo$0 = require('foo');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import foo from "foo";`, t => {
	t.is(fn(`import foo from "foo";`), `const foo$0 = require('foo');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import foo from "./foo"`, t => {
	t.is(fn(`import foo from "./foo"`), `const foo$0 = require('./foo');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import foo from "../foo/bar"`, t => {
	t.is(fn(`import foo from "../foo/bar"`), `const foo$0 = require('../foo/bar');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import foo from "../foo/bar";`, t => {
	t.is(fn(`import foo from "../foo/bar";`), `const foo$0 = require('../foo/bar');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

// Partial Imports

test(`import { foo, bar } from 'baz'`, t => {
	const out = `const baz$0 = require('baz');\nconst foo = baz$0.foo;\nconst bar = baz$0.bar;`;
	t.is(fn(`import { foo, bar } from 'baz'`), out);
	t.end();
});

test(`import { foo, bar } from '../baz'`, t => {
	const out = `const baz$0 = require('../baz');\nconst foo = baz$0.foo;\nconst bar = baz$0.bar;`
	t.is(fn(`import { foo, bar } from '../baz'`), out);
	t.end();
});

// Mixed Imports

test(`import baz, { foo, bar } from 'baz'`, t => {
	const out = `const baz$0 = require('baz');
const baz = baz$0.default || baz$0;
const foo = baz$0.foo;
const bar = baz$0.bar;`;
	t.is(fn(`import baz, { foo, bar } from 'baz'`), out);
	t.end();
});

test(`import baz, { foo, bar } from '../baz'`, t => {
	const out = `const baz$0 = require('../baz');
const baz = baz$0.default || baz$0;
const foo = baz$0.foo;
const bar = baz$0.bar;`;
	t.is(fn(`import baz, { foo, bar } from '../baz'`), out);
	t.end();
});

test(`import baz, { foo } from 'baz';import bat, { foo as bar } from 'bat';`, t => {
	const out = `const baz$0 = require('baz');
const baz = baz$0.default || baz$0;
const foo = baz$0.foo;const bat$1 = require('bat');
const bat = bat$1.default || bat$1;
const bar = bat$1.foo;`;
	t.is(fn(`import baz, { foo } from 'baz';import bat, { foo as bar } from 'bat';`), out);
	t.end();
});

test(`import baz, { foo as bar, bar as bat } from 'baz'`, t => {
	const out = `const baz$0 = require('baz');
const baz = baz$0.default || baz$0;
const bar = baz$0.foo;
const bat = baz$0.bar;`;
	t.is(fn(`import baz, { foo as bar, bar as bat } from 'baz'`), out);
	t.end();
});

test(`import baz,{foo as bar} from 'baz';import quz,{foo as bat}from'quz';`, t => {
	const out = `const baz$0 = require('baz');
const baz = baz$0.default || baz$0;
const bar = baz$0.foo;const quz$1 = require('quz');
const quz = quz$1.default || quz$1;
const bat = quz$1.foo;`;
	t.is(fn(`import baz,{foo as bar} from 'baz';import quz,{foo as bat}from'quz';`), out);
	t.end();
});

// No spaces

test(`import'foo'`, t => {
	t.is(fn(`import'foo'`), `require('foo');`);
	t.end();
});

test(`import foo from'foo'`, t => {
	t.is(fn(`import foo from'foo'`), `const foo$0 = require('foo');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import{foo,bar}from'baz'`, t => {
	const out = `const baz$0 = require('baz');\nconst foo = baz$0.foo;\nconst bar = baz$0.bar;`;
	t.is(fn(`import{foo,bar}from'baz'`), out);
	t.end();
});

test(`import{foo,bar}from'../baz'`, t => {
	const out = `const baz$0 = require('../baz');\nconst foo = baz$0.foo;\nconst bar = baz$0.bar;`
	t.is(fn(`import{foo,bar}from'../baz'`), out);
	t.end();
});

// Dashes

test(`import foo from "foo-bar"`, t => {
	t.is(fn(`import foo from "foo-bar"`), `const foo$0 = require('foo-bar');\nconst foo = foo$0.default || foo$0;`);
	t.end();
});

test(`import {foo, bar} from 'foo-bar'`, t => {
	const out = `const foo_bar$0 = require('foo-bar');\nconst foo = foo_bar$0.foo;\nconst bar = foo_bar$0.bar;`
	t.is(fn(`import {foo, bar} from 'foo-bar'`), out);
	t.end();
});

// Aliases

test(`import { default as main } from 'foo'`, t => {
	t.is(fn(`import { default as main } from 'foo'`), `const foo$0 = require('foo');\nconst main = foo$0.default;`);
	t.end();
});

test(`import { foo as bar } from 'baz'`, t => {
	t.is(fn(`import { foo as bar } from 'baz'`), `const baz$0 = require('baz');\nconst bar = baz$0.foo;`);
	t.end();
});

test(`import { bar, default as main } from '../foo'`, t => {
	const out = `const foo$0 = require('../foo');\nconst bar = foo$0.bar;\nconst main = foo$0.default;`
	t.is(fn(`import { bar, default as main } from '../foo'`), out);
	t.end();
});

test(`import { foo as bar, default as main } from '../foo'`, t => {
	const out = `const foo$0 = require('../foo');\nconst bar = foo$0.foo;\nconst main = foo$0.default;`
	t.is(fn(`import { foo as bar, default as main } from '../foo'`), out);
	t.end();
});

test(`import {foo as bar, default as main} from '../foo'`, t => {
	const out = `const foo$0 = require('../foo');\nconst bar = foo$0.foo;\nconst main = foo$0.default;`
	t.is(fn(`import {foo as bar, default as main} from '../foo'`), out);
	t.end();
});

test(`import * as foo from '../foo'`, t => {
	const out = `const foo$0 = require('../foo');\nconst foo = foo$0.default || foo$0;`
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
	const out = `const baz$0 = require('baz');\nconst foo = baz$0.foo;\nconst bar = baz$0.bar;\nconst baz = baz$0.bat;`;
	t.is(fn(str), out);
	t.end();
});

test(`multi-line -- relative`, t => {
	const str = `import {
		foo,
		bar,
		bat as baz
	} from '../baz'`;
	const out = `const baz$0 = require('../baz');\nconst foo = baz$0.foo;\nconst bar = baz$0.bar;\nconst baz = baz$0.bat;`
	t.is(fn(str), out);
	t.end();
});

// Muiltiple statements

test(`import foo from 'foo';import bar from 'bar';`, t => {
	const out = `const foo$0 = require('foo');
const foo = foo$0.default || foo$0;const bar$1 = require('bar');
const bar = bar$1.default || bar$1;`;
	t.is(fn(`import foo from 'foo';import bar from 'bar';`), out);
	t.end();
});

test(`import foo from 'foo'\\nimport { baz1, baz2 } from 'baz'`, t => {
	const out = `const foo$0 = require('foo');
const foo = foo$0.default || foo$0;
const baz$1 = require('baz');
const baz1 = baz$1.baz1;
const baz2 = baz$1.baz2;`;
	t.is(fn(`import foo from 'foo'\nimport { baz1, baz2 } from 'baz'`), out);
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

// Ensure Uniqueness

test(`import { promisify } from 'util';import { foo as bar } from './util';`, t => {
	const out = `const util$0 = require('util');\nconst promisify = util$0.promisify;const util$1 = require('./util');\nconst bar = util$1.foo;`;
	t.is(fn(`import { promisify } from 'util';import { foo as bar } from './util';`), out);
	t.end();
});

test(`import util, { promisify } from 'util';import { foo as bar } from './util';`, t => {
	const out = `const util$0 = require('util');
const util = util$0.default || util$0;
const promisify = util$0.promisify;const util$1 = require('./util');
const bar = util$1.foo;`;
	t.is(fn(`import util, { promisify } from 'util';import { foo as bar } from './util';`), out);
	t.end();
});

test(`import { h } from 'preact';import { Component } from 'preact';`, t => {
	const out = `const preact$0 = require('preact');\nconst h = preact$0.h;const preact$1 = require('preact');\nconst Component = preact$1.Component;`;
	t.is(fn(`import { h } from 'preact';import { Component } from 'preact';`), out);
	t.end();
});
