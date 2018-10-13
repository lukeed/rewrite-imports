# rewrite-imports [![Build Status](https://travis-ci.org/lukeed/rewrite-imports.svg?branch=master)](https://travis-ci.org/lukeed/rewrite-imports)

Transforms various `import` statements into ES5-compatible `require()` calls, using regular expressions.

## Caveats

* Returns a string and **does not** provide a runtime nor does it evaluate the output.

  > :bulb: For this behavior, use [`rewrite-module`](https://github.com/lukeed/rewrite-module) or check out [`@taskr/esnext`](https://github.com/lukeed/taskr/tree/master/packages/esnext) for an example.

* Have [false positives](https://github.com/lukeed/rewrite-imports/issues/8), you may want to use an AST to find actual `import` statements before transformation.

  > :bulb: Check out an [example implementation](https://github.com/styleguidist/react-styleguidist/blob/82f22d217044dee6215e60696c39791ee168fc14/src/client/utils/transpileImports.js).

## Install

```
$ npm install --save rewrite-imports
```


## Usage

```js
const rewriteImports = require('rewrite-imports');

rewriteImports(`import foo from '../bar'`);
//=> const foo = require('../bar');

rewriteImports(`import { foo } from 'bar'`);
//=> const bar$1 = require('bar');
//=> const foo = bar$1.foo;

rewriteImports(`import * as path from 'path';`);
//=> const path = require('path');

rewriteImports(`import { foo as bar, baz as bat, lol } from 'quz';`);
//=> const quz$1 = require('quz');
//=> const bar = quz$1.foo;
//=> const bat = quz$1.baz;
//=> const lol = quz$1.lol;
```


## API

### rewriteImports(input)

#### input
Type: `String`

An `import` statement. See [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) for valid Syntax.


## License

MIT © [Luke Edwards](https://lukeed.com)
