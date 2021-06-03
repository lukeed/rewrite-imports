import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { rewrite } from '../src';

function run(input, output, extra) {
	test(JSON.stringify(input), () => {
		let result = rewrite(input, extra);
		assert.is(result, output);
		assert.not.throws(() => {
			new Function(result)
		});
	});
}

// Single quotes
// ---
run(
	`import foo from 'foo'`,
	`const foo = require('foo')`
);
run(
	`import foo from 'foo';`,
	`const foo = require('foo');`
);
run(
	`import foo from './foo'`,
	`const foo = require('./foo')`
);
run(
	`import foo from '../foo/bar'`,
	`const foo = require('../foo/bar')`
);
run(
	`import foo from '../foo/bar';`,
	`const foo = require('../foo/bar');`
);

// Double quotes
// ---
run(
	`import foo from "foo"`,
	`const foo = require("foo")`
);
run(
	`import foo from "foo";`,
	`const foo = require("foo");`
);
run(
	`import foo from "./foo"`,
	`const foo = require("./foo")`
);
run(
	`import foo from "../foo/bar"`,
	`const foo = require("../foo/bar")`
);
run(
	`import foo from "../foo/bar";`,
	`const foo = require("../foo/bar");`
);

// Template quotes
// ---
run(
	"import foo from `foo`",
	"const foo = require(`foo`)"
);
run(
	"import foo from `foo`;",
	"const foo = require(`foo`);"
);
run(
	"import foo from `./foo`",
	"const foo = require(`./foo`)"
);
run(
	"import foo from `../foo/bar`",
	"const foo = require(`../foo/bar`)"
);
run(
	"import foo from `../foo/bar`;",
	"const foo = require(`../foo/bar`);"
);

// Partial Imports
// ---
run(
	`import { foo, bar } from 'baz'`,
	`const { foo, bar } = require('baz')`
);
run(
	`import { foo, bar } from '../baz'`,
	`const { foo, bar } = require('../baz')`
);
run(
	"import { foo, bar } from `baz`",
	"const { foo, bar } = require(`baz`)"
);
run(
	"import { foo, bar } from `../baz`",
	"const { foo, bar } = require(`../baz`)"
);

// Mixed Imports
// ---
run(
	`import baz, { foo, bar } from 'baz'`,
	`const baz = require('baz');\nconst { foo, bar } = baz`
);
run(
	`import baz, { foo, bar } from '../baz'`,
	`const baz = require('../baz');\nconst { foo, bar } = baz`
);
run(
	`import baz, { foo } from 'baz';import bat, { foo as bar } from 'bat';`,
	`const baz = require('baz');\nconst { foo } = baz;const bat = require('bat');\nconst { foo:bar } = bat;`
);
run(
	`import baz, { foo as bar, bar as bat } from 'baz'`,
	`const baz = require('baz');\nconst { foo:bar, bar:bat } = baz`
);
run(
	`import baz, {foo as bar} from 'baz';import quz, {foo as bat} from 'quz';`,
	`const baz = require('baz');\nconst { foo:bar } = baz;const quz = require('quz');\nconst { foo:bat } = quz;`
);

// Aliases
// ---
run(
	`import { default as main } from 'foo'`,
	`const { default:main } = require('foo')`
);
run(
	`import { foo as bar } from 'baz'`,
	`const { foo:bar } = require('baz')`
);
run(
	`import { bar, default as main } from '../foo'`,
	`const { bar, default:main } = require('../foo')`
);
run(
	`import { foo as bar, default as main } from '../foo'`,
	`const { foo:bar, default:main } = require('../foo')`
);
run(
	`import baz, { foo as bar, default as main } from '../foo'`,
	`const baz = require('../foo');\nconst { foo:bar, default:main } = baz`
);
run(
	`import * as foo from '../foo'`,
	`const foo = require('../foo')`
);

// Raw imports
// ---
run(
	`import 'bar'`,
	`require('bar')`
);
run(
	`import './foo';`,
	`require('./foo');`
);
run(
	`import './foo';import 'bar';`,
	`require('./foo');require('bar');`
);
run(
	"import `./foo`;",
	"require(`./foo`);"
);
run(
	"import `./foo`;import `bar`;",
	"require(`./foo`);require(`bar`);"
);

// Multi-line
// ---
run(
	`import {\n\tfoo,\n\tbar,\n\tbat as baz\n} from 'baz'`,
	`const { foo, bar, bat:baz } = require('baz')`
);
run(
	`import {\n\tfoo,\n\tbar,\n\tbat as baz\n} from '../baz';`,
	`const { foo, bar, bat:baz } = require('../baz');`
);

// Muiltiple statements
// ---
run(
	`import foo from 'foo';import bar from 'bar';`,
	`const foo = require('foo');const bar = require('bar');`
);
run(
	`import foo from 'foo'\nimport { baz1, baz2 } from 'baz'`,
	`const foo = require('foo')\nconst { baz1, baz2 } = require('baz')`
);
run(
	`import 'bar';import './foo';`,
	`require('bar');require('./foo');`
);
run(
	`import './foo'\n\nimport 'bar'`,
	`require('./foo')\n\nrequire('bar')`
);

// Ensure Uniqueness
// ---
run(
	`import { promisify } from 'util';import { foo as bar } from './util';`,
	`const { promisify } = require('util');const { foo:bar } = require('./util');`
);
run(
	`import util, { promisify } from 'util';import helpers, { foo as bar } from './util';`,
	`const util = require('util');\nconst { promisify } = util;const helpers = require('./util');\nconst { foo:bar } = helpers;`
);
run(
	`import { h } from 'preact';import { Component } from 'preact';`,
	`const { h } = require('preact');const { Component } = require('preact');`
);

// No spaces
// ---
run(
	`import'foo'`,
	`require('foo')`
);
run(
	`import'foo';import'./bar';import baz from'baz';`,
	`require('foo');require('./bar');const baz = require('baz');`
);
run(
	`import foo from'foo'`,
	`const foo = require('foo')`
);
run(
	`import{foo,bar}from'baz'`,
	`const { foo, bar } = require('baz')`
);
run(
	`import{foo,bar}from'../baz';;;`,
	`const { foo, bar } = require('../baz');;;`
);
run(
	`import{foo,bar as baz}from'../baz'`,
	`const { foo, bar:baz } = require('../baz')`
);

// Dashes
// ---
run(
	`import foo from "foo-bar"`,
	`const foo = require("foo-bar")`
);
run(
	`import {foo, bar} from 'foo-bar';`,
	`const { foo, bar } = require('foo-bar');`
);
run(
	`import baz, {foo, bar} from 'foo-bar'`,
	`const baz = require('foo-bar');\nconst { foo, bar } = baz`
);
run(
	`import a, {b} from 'c'`,
	`const a = pizza('c');\nconst { b } = a`,
	'pizza'
);

// No-partial/mid selection
// ---
run(
	`import '$dimport';`,
	`require('$dimport');`
);
run(
	`import 'dimport';`,
	`require('dimport');`
);
run(
	`import foo from 'dimport';`,
	`const foo = require('dimport');`
);
run(
	`import fooimportbar from '$import$';`,
	`const fooimportbar = require('$import$');`
);
run(
	`import dimport,{foo}from'dimport';import bat,{foo as bar}from'bat';`,
	`const dimport = require('dimport');\nconst { foo } = dimport;const bat = require('bat');\nconst { foo:bar } = bat;`
);
run(
	`import dimport, { foo } from 'dimport'; import bat, { foo as bar } from 'bat';`,
	`const dimport = require('dimport');\nconst { foo } = dimport; const bat = require('bat');\nconst { foo:bar } = bat;`
);
run(
	`import { dimport } from 'dimport'; import './foo';`,
	`const { dimport } = require('dimport'); require('./foo');`,
);

// Within a string
// ---
run(
	`var text = "import { dimport } from 'dimport'; import './foo';";`,
	`var text = "import { dimport } from 'dimport'; import './foo';";`,
);
run(
	"var text = `import { dimport } from 'dimport'; import './foo';`;",
	"var text = `import { dimport } from 'dimport'; import './foo';`;",
);
run(
	'var text = `import { dimport } from "dimport"; import "./foo";`',
	'var text = `import { dimport } from "dimport"; import "./foo";`',
);
run(
	`var text = "import foo from 'foo'; import'./bar'"`,
	`var text = "import foo from 'foo'; import'./bar'"`,
);
run(
	"var text=`import foo from 'foo'; import'./bar'`",
	"var text=`import foo from 'foo'; import'./bar'`",
);
run(
	"var text=`import{foo}from'foo';import bar,{baz}from'./bar'`",
	"var text=`import{foo}from'foo';import bar,{baz}from'./bar'`",
);
run(
	"var text=`\n\timport{foo}from'foo';\n\timport bar,{baz}from'./bar';\n`;",
	"var text=`\n\timport{foo}from'foo';\n\timport bar,{baz}from'./bar';\n`;",
);
run(
	`var text='\\n\\timport{foo}from"foo";\\n\\timport bar,{baz}from"./bar";';`,
	`var text='\\n\\timport{foo}from"foo";\\n\\timport bar,{baz}from"./bar";';`,
);
run(
	'var text="import \'foo\';import`./bar`\\nimport\'baz\';";',
	'var text="import \'foo\';import`./bar`\\nimport\'baz\';";',
);

// Non-alphanum identifier
// ---
run(
	`import * as $ from "foobar";`,
	`const $ = require("foobar");`
);
run(
	`import * as $ from "foobar";import * as _ from 'baz';`,
	`const $ = require("foobar");const _ = require('baz');`
);
run(
	`import foo1 from 'foo';import { foo2, _lol } from 'bar';`,
	`const foo1 = require('foo');const { foo2, _lol } = require('bar');`
);
run(
	`import $foo from 'foo'\nimport { $baz1, $01 } from 'baz'`,
	`const $foo = require('foo')\nconst { $baz1, $01 } = require('baz')`
);

test.run();
