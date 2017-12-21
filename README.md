# node-one-mocha

>Generate mocha tester by one object.

## Install
```bash
npm install one-mocha
```

## How to use
```javascript
    const genMocha = require('one-mocha');
    var sample =
        [{
            method: (str) => typeof str === 'string',
            test: {
                assert: 'equal',
                args: [["A", true],
                       ["B", true],
                       [1, false]]
            }
        },
         {
             method: (str) => typeof str === 'number',
             test: {
                 assert: 'equal',
                 args: [["A", false],
                        ["B", false],
                        [1, true]]
             }
         }];
    genMocha(sample);
```

## Object structure
- `method <function>` : anything method to test.
- `test <Object|Array>` : the test object using `method`.
    - `assert <string>` : method name of [assert](https://nodejs.org/api/assert.html).
    - `args <Array>` : the argument array for the execution unit.
        - `execArgs` : the last argument uses as assert's `expected` argument, rest of arguments are used in method's arguments.

## Example of making test object

- One method, One test, One execution.
```javascript
    var test1 =
        {
            method: path.resolve,
            test: {
                assert: 'equal',
                args: [["./", __dirname]]
            }
        };
```

- One method, One test, Multiple executions.
```javascript
    var test2 =
        {
            method: (str) => typeof str === 'string',
            test: {
                assert: 'equal',
                args: [["A", true],
                       ["B", true],
                       [1, false]]
            }
        };
```
		
- One method, Multiple tests.
```javascript
    var test3 =
        {
            method: (str) => typeof str === 'string',
            test:
            [{
                assert: 'equal',
                args: [["A", true],
                       ["B", true],
                       [1, false]]
            },
             {
                 assert: 'notEqual',
                 args: [["A", false],
                        ["B", false],
                        [1, true]]
             }
            ]
        };

```

- Multiple methods
```javascript
    var test4 =
        [{
            method: (str) => typeof str === 'string',
            test: {
                assert: 'equal',
                args: [["A", true],
                       ["B", true],
                       [1, false]]
            }
        },
         {
             method: (str) => typeof str === 'number',
             test: {
                 assert: 'equal',
                 args: [["A", false],
                        ["B", false],
                        [1, true]]
             }
         }];
```
		 
## Dependency

- [mocha](https://github.com/mochajs/mocha)
