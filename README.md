[![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url]

node-envie
==================

> Tiny module to read and document environment configuration

Envie parses and validates configuration read from the environment
via `process.env`. Uses Joi for validation.

Installation
------------

    npm install --save envie

Usage
-----

```javascript
const Envie = require('envie')
const Joi = require('joi')

const envie = Envie({
  PORT: Joi
    .number()
    .min(0)
    .default(0)
    .description('Port on which the HTTP server will listen'),

  DATABASE_URL: Joi
    .string()
    .uri(({ scheme: ['postgres', 'mysql', 'sqlite'] }))
    .description('Connection string of the main database'),

  LOG_LEVEL: Joi
    .string()
    .only('fatal', 'error', 'warn', 'info', 'debug', 'trace')
    .default('info')
    .description('Level of verbosity for the logs')
})


server.listen(envie.get('PORT'))
DatabaseService.use('envie.get('DATABASE_URL')')
```

Undescribed keys can be requested as well but will not be validated.


You can also display a nicely formatted help output

```javascript
envie.displayHelp()
```

```
	PORT (number)
    Port on which the HTTP server will listen

	LOG_LEVEL (string, default: debug)
    Level of verbosity for the logs

	DATABASE_URL (string <uri:postgres|mysql|sqlite>)
    Connection string of the main database

```

Reference
---------

#### `[new] Envie(description[, values=process.env])`

Creates a new `envie` instance which parses the keys of the object `values` using the `description`.
`description` must be an object whose keys contain a [Joi](https://www.npmjs.com/package/joi) validator.
By default, `process.env` is parsed. The `new` keyword is optional.

#### `envie.get(key)`

Reads the parsed value for `key` if present and valid. Throws if the value is not valid.

#### `envie.has(key)`

Returns `true` if the key is properly configured.

#### `envie.validate()`

Throws if any validator failed.

#### `envie.displayHelp([stream=process.stderr])`

Outputs to the given `stream` a human readable description of the expected configuration

Test
----

You can run the tests with `npm test`. You will need to know [mocha][mocha-url]

Contributing
------------

Anyone is welcome to submit issues and pull requests


License
-------

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Florent Jaby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[travis-image]: http://img.shields.io/travis/Floby/node-envie/master.svg?style=flat
[travis-url]: https://travis-ci.org/Floby/node-envie
[coveralls-image]: http://img.shields.io/coveralls/Floby/node-envie/master.svg?style=flat
[coveralls-url]: https://coveralls.io/r/Floby/node-envie
[mocha-url]: https://github.com/visionmedia/mocha


