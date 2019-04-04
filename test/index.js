'use strict';

const test = require('tape');
const fn = require('../dist/rewrite');

[
	// Single quotes
	[
		`import foo from 'foo'`,
		`const foo = require('foo');`
	],
	[
		`import foo from 'foo';`,
		`const foo = require('foo');`
	],
	[
		`import foo from './foo'`,
		`const foo = require('./foo');`
	],
	[
		`import foo from '../foo/bar'`,
		`const foo = require('../foo/bar');`
	],
	[
		`import foo from '../foo/bar';`,
		`const foo = require('../foo/bar');`
	],

	// Double quotes
	[
		`import foo from "foo"`,
		`const foo = require('foo');`
	],
	[
		`import foo from "foo";`,
		`const foo = require('foo');`
	],
	[
		`import foo from "./foo"`,
		`const foo = require('./foo');`
	],
	[
		`import foo from "../foo/bar"`,
		`const foo = require('../foo/bar');`
	],
	[
		`import foo from "../foo/bar";`,
		`const foo = require('../foo/bar');`
	],

	// Partial Imports
	[
		`import { foo, bar } from 'baz'`,
		`const { foo, bar } = require('baz');`
	],
	[
		`import { foo, bar } from '../baz'`,
		`const { foo, bar } = require('../baz');`
	],

	// Mixed Imports
	[
		`import baz, { foo, bar } from 'baz'`,
		`const baz = require('baz');
const { foo, bar } = baz;`
	],
	[
		`import baz, { foo, bar } from '../baz'`,
		`const baz = require('../baz');
const { foo, bar } = baz;`
	],
	[
		`import baz, { foo } from 'baz';import bat, { foo as bar } from 'bat';`,
		`const baz = require('baz');
const { foo } = baz;const bat = require('bat');
const { foo:bar } = bat;`
	],
	[
		`import baz, { foo as bar, bar as bat } from 'baz'`,
		`const baz = require('baz');
const { foo:bar, bar:bat } = baz;`
	],
	[
		`import baz, {foo as bar} from 'baz';import quz, {foo as bat} from 'quz';`,
		`const baz = require('baz');
const { foo:bar } = baz;const quz = require('quz');
const { foo:bat } = quz;`
	],

	// Aliases
	[
		`import { default as main } from 'foo'`,
		`const { default:main } = require('foo');`
	],
	[
		`import { foo as bar } from 'baz'`,
		`const { foo:bar } = require('baz');`
	],
	[
		`import { bar, default as main } from '../foo'`,
		`const { bar, default:main } = require('../foo');`
	],
	[
		`import { foo as bar, default as main } from '../foo'`,
		`const { foo:bar, default:main } = require('../foo');`
	],
	[
		`import baz, { foo as bar, default as main } from '../foo'`,
		`const baz = require('../foo');
const { foo:bar, default:main } = baz;`
	],
	[
		`import * as foo from '../foo'`,
		`const foo = require('../foo');`
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
		`const { foo, bar, bat:baz } = require('baz');`
	],
	[
		`import {
	foo,
	bar,
	bat as baz
} from '../baz'`,
		`const { foo, bar, bat:baz } = require('../baz');`
	],

	// Muiltiple statements
	[
		`import foo from 'foo';import bar from 'bar';`,
		`const foo = require('foo');const bar = require('bar');`
	],
	[
		`import foo from 'foo'\nimport { baz1, baz2 } from 'baz'`,
		`const foo = require('foo');\nconst { baz1, baz2 } = require('baz');`
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
		`const { promisify } = require('util');const { foo:bar } = require('./util');`
	],
	[
		`import util, { promisify } from 'util';import helpers, { foo as bar } from './util';`,
		`const util = require('util');
const { promisify } = util;const helpers = require('./util');
const { foo:bar } = helpers;`
	],
	[
		`import { h } from 'preact';import { Component } from 'preact';`,
		`const { h } = require('preact');const { Component } = require('preact');`
	],

	// No spaces
	[
		`import'foo'`,
		`require('foo');`
	],
	[
		`import foo from'foo'`,
		`const foo = require('foo');`
	],
	[
		`import{foo,bar}from'baz'`,
		`const { foo, bar } = require('baz');`
	],
	[
		`import{foo,bar}from'../baz'`,
		`const { foo, bar } = require('../baz');`
	],
	[
		`import{foo,bar as baz}from'../baz'`,
		`const { foo, bar:baz } = require('../baz');`
	],

	// Dashes
	[
		`import foo from "foo-bar"`,
		`const foo = require('foo-bar');`
	],
	[
		`import {foo, bar} from 'foo-bar'`,
		`const { foo, bar } = require('foo-bar');`
	],
	[
		`import baz, {foo, bar} from 'foo-bar'`,
		`const baz = require('foo-bar');\nconst { foo, bar } = baz;`
	],
	[
		`import a, {b} from 'c'`,
		`const a = pizza('c');\nconst { b } = a;`,
		'pizza'
	],
].forEach(arr => {
	let code = arr[0];
	let expected = arr[1];
	let extra = arr[2];

	test(code, t => {
		const result = fn(code, extra);
		t.doesNotThrow(() => new Function(result), SyntaxError);
		t.is(result, expected);
		t.end();
	})
});
