const test = require('tape');
const fn = require('../src');

[
	// Single quotes
	[
		`import foo from 'foo'`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('foo'));`
	],
	[
		`import foo from 'foo';`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('foo'));`
	],
	[
		`import foo from './foo'`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('./foo'));`
	],
	[
		`import foo from '../foo/bar'`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('../foo/bar'));`
	],
	[
		`import foo from '../foo/bar';`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('../foo/bar'));`
	],

	// Double quotes
	[
		`import foo from "foo"`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('foo'));`
	],
	[
		`import foo from "foo";`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('foo'));`
	],
	[
		`import foo from "./foo"`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('./foo'));`
	],
	[
		`import foo from "../foo/bar"`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('../foo/bar'));`
	],
	[
		`import foo from "../foo/bar";`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('../foo/bar'));`
	],

	// Partial Imports
	[
		`import { foo, bar } from 'baz'`,
		`const baz$0 = require('baz');
const foo = baz$0.foo;
const bar = baz$0.bar;`
	],
	[
		`import { foo, bar } from '../baz'`,
		`const baz$0 = require('../baz');
const foo = baz$0.foo;
const bar = baz$0.bar;`
	],

	// Mixed Imports
	[
		`import baz, { foo, bar } from 'baz'`,
		`function ri$interop(m){return m.default||m}
const baz = ri$interop(require('baz'));
const foo = baz.foo;
const bar = baz.bar;`
	],
	[
		`import baz, { foo, bar } from '../baz'`,
		`function ri$interop(m){return m.default||m}
const baz = ri$interop(require('../baz'));
const foo = baz.foo;
const bar = baz.bar;`
	],
	[
		`import baz, { foo } from 'baz';import bat, { foo as bar } from 'bat';`,
		`function ri$interop(m){return m.default||m}
const baz = ri$interop(require('baz'));
const foo = baz.foo;const bat = ri$interop(require('bat'));
const bar = bat.foo;`
	],
	[
		`import baz, { foo as bar, bar as bat } from 'baz'`,
		`function ri$interop(m){return m.default||m}
const baz = ri$interop(require('baz'));
const bar = baz.foo;
const bat = baz.bar;`
	],
	[
		`import baz, {foo as bar} from 'baz';import quz, {foo as bat} from 'quz';`,
		`function ri$interop(m){return m.default||m}
const baz = ri$interop(require('baz'));
const bar = baz.foo;const quz = ri$interop(require('quz'));
const bat = quz.foo;`
	],

	// Aliases
	[
		`import { default as main } from 'foo'`,
		`const foo$0 = require('foo');
const main = foo$0.default;`
	],
	[
		`import { foo as bar } from 'baz'`,
		`const baz$0 = require('baz');
const bar = baz$0.foo;`
	],
	[
		`import { bar, default as main } from '../foo'`,
		`const foo$0 = require('../foo');
const bar = foo$0.bar;
const main = foo$0.default;`
	],
	[
		`import { foo as bar, default as main } from '../foo'`,
		`const foo$0 = require('../foo');
const bar = foo$0.foo;
const main = foo$0.default;`
	],
	[
		`import baz, { foo as bar, default as main } from '../foo'`,
		`function ri$interop(m){return m.default||m}
const baz = ri$interop(require('../foo'));
const bar = baz.foo;
const main = baz.default;`
	],
	[
		`import * as foo from '../foo'`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('../foo'));`
	],

	// Raw imports
	[
		`import 'bar'`,
		`require('bar');`
	],
	[
		`import './foo';`,
		`require('./foo');`
	],

	// Multi-line
	[
		`import {
	foo,
	bar,
	bat as baz
} from 'baz'`,
		`const baz$0 = require('baz');
const foo = baz$0.foo;
const bar = baz$0.bar;
const baz = baz$0.bat;`
	],
	[
		`import {
	foo,
	bar,
	bat as baz
} from '../baz'`,
		`const baz$0 = require('../baz');
const foo = baz$0.foo;
const bar = baz$0.bar;
const baz = baz$0.bat;`
	],

	// Muiltiple statements
	[
		`import foo from 'foo';import bar from 'bar';`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('foo'));const bar = ri$interop(require('bar'));`
	],
	[
		`import foo from 'foo'\nimport { baz1, baz2 } from 'baz'`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('foo'));
const baz$0 = require('baz');
const baz1 = baz$0.baz1;
const baz2 = baz$0.baz2;`
	],
	[
		`import 'bar';import './foo';`,
		`require('bar');require('./foo');`
	],
	[
		`import './foo'
import 'bar'`,
		`require('./foo');
require('bar');`
	],

	// Ensure Uniqueness
	[
		`import { promisify } from 'util';import { foo as bar } from './util';`,
		`const util$0 = require('util');
const promisify = util$0.promisify;const util$1 = require('./util');
const bar = util$1.foo;`
	],
	[
		`import util, { promisify } from 'util';import { foo as bar } from './util';`,
		`function ri$interop(m){return m.default||m}
const util = ri$interop(require('util'));
const promisify = util.promisify;const util$0 = require('./util');
const bar = util$0.foo;`
	],
	[
		`import { h } from 'preact';import { Component } from 'preact';`,
		`const preact$0 = require('preact');
const h = preact$0.h;const preact$1 = require('preact');
const Component = preact$1.Component;`
	],

	// No spaces
	[
		`import'foo'`,
		`require('foo');`
	],
	[
		`import foo from'foo'`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('foo'));`
	],
	[
		`import{foo,bar}from'baz'`,
		`const baz$0 = require('baz');
const foo = baz$0.foo;
const bar = baz$0.bar;`
	],
	[
		`import{foo,bar}from'../baz'`,
		`const baz$0 = require('../baz');
const foo = baz$0.foo;
const bar = baz$0.bar;`
	],
	[
		`import{foo,bar as baz}from'../baz'`,
		`const baz$0 = require('../baz');
const foo = baz$0.foo;
const baz = baz$0.bar;`
	],

	// Dashes
	[
		`import foo from "foo-bar"`,
		`function ri$interop(m){return m.default||m}
const foo = ri$interop(require('foo-bar'));`
	],
	[
		`import {foo, bar} from 'foo-bar'`,
		`const foo_bar$0 = require('foo-bar');
const foo = foo_bar$0.foo;
const bar = foo_bar$0.bar;`
	],
	[
		`import baz, {foo, bar} from 'foo-bar'`,
		`function ri$interop(m){return m.default||m}
const baz = ri$interop(require('foo-bar'));
const foo = baz.foo;
const bar = baz.bar;`
	],
].forEach(([code, expected]) => {
	test(code, t => {
		const result = fn(code);
		t.doesNotThrow(() => new Function(result), SyntaxError);
		t.is(result, expected);
		t.end();
	})
})
