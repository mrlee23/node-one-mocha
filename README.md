# node-one-mocha

>Generate mocha tester by one object.

## Dependencies

- [mocha](https://github.com/mochajs/mocha)
- [sprintf](https://github.com/maritz/node-sprintf)

## Install
```bash
npm install one-mocha
```

## How to use
```javascript
    const oneMocha = require('one-mocha');
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
    oneMocha(sample);
```

## Object structure
- `method <function>` : Anything method to test.
- `name <string>` : Use an alternative name instead of the method name. It is useful when the method like prototype method has no name.
- `this <Object>` : Used for `this` argument of method to call.
- `desc <string>` : The description of methods functionality.
- `test <Object|Array>` : The test object using `method`.
    - `assert <string>` : Method name of [assert](https://nodejs.org/api/assert.html).
    - `args <Array>` : The argument array for the execution unit.
        - `execArgs` : The last argument uses as assert's `expected` argument, rest of arguments are used in method's arguments.

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

## Customize output format
**one-mocha** supports customizable output format using `options` argument.
The format has two difference types. One format type is string generated by `sprintf` the other format type is function can be access specific arguments of output parameters.

- `truncate<number>`: Set output length for truncating extra length of `argument` and `expected`.
- `truncatePos<number>`: Set position of truncating string.
- `methodFormat<string|function>` : This format generate on method `description` block.
- `assertFormat<string|function>`: This format generate on assert `description` block.
- `executionFormat<string|function>`: This format generate on test execution `it` block.

```javascript
oneMocha(test4, {
	methodFormat: (methodName, name, desc) => {
		name != null && (methodName = name);
		return '#.'+[methodName, desc].filter(e => e != null).join(': ');
	},
	assertFormat: "#.%s"
	executionFormat: "#.(%s) => %s"
});
```
