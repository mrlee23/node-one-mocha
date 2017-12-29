/**
 * @fileOverview Generate mocha tester by one object.
 * @name index.js
 * @author Dongsoo Lee <mrlee_23@naver.com>
 * @copyright 2017 Dongsoo Lee <mrlee_23@naver.com>
 * @module index
 * @version 0.0.9
 * @since 0.0.1
 * @created 2017-12-26
 *
 * @requires module:assert
 * @requires module:sprint
 * @requires module:smart-truncate
 */

const assert = require('assert'),
	  sprintf = require('sprintf').sprintf,
	  smartTruncate = require('smart-truncate');

function OneMocha (obj, options = {}) {
	let truncate = 25,
		truncatePos = truncate/3;
	options = Object.assign({
		truncate: truncate,
		truncatePos: truncatePos,
		methodFormat: (methodName, name, desc) => {
			name != null && (methodName = name);
			return '#.'+[methodName, desc].filter(e => e != null).join(': ');
		},
		assertFormat: "#.%s",
		executionFormat: (args, expected) => sprintf("#.(%s) => %s",
													 serializeText(args, options.truncate || truncate, options.truncatePos || truncatePos),
													 serializeText(expected, options.truncate || truncate , options.truncatePos || truncatePos))
	}, options);
	if (typeof obj !== 'object') throw new Error(`Need object or array`);
	!Array.isArray(obj) && (obj = [obj]);
	obj.forEach(o => {
		let m = o.method,
			thisArg = o.this,
			name = o.name,
			desc = o.desc,
			test = o.test;
		if (typeof m !== 'function') throw new Error(`method(${m}) is not a function.`);
		if (name != null && typeof name !== 'string') throw new Error(`name(${name}) is not a string.`);
		if (desc != null && typeof desc !== 'string') throw new Error(`desc(${desc}) is not a string.`);
		if (typeof test !== 'object') throw new Error(`test needs object or array.`);
		!Array.isArray(test) && (test = [test]);
		describe(descHandler(options.methodFormat, m.name, name, desc), function () {
			test.forEach(t => {
				let asrt = t.assert,
					msg = t.message,
					argsArr = t.args;
				if (typeof asrt !== 'string' && Array.isArray(asrt)) throw new Error(`test.assert needs object or array.`);
				if (!Array.isArray(argsArr)) throw new Error(`test.args is not an array.`);
				!Array.isArray(asrt) && (asrt = [asrt]);
				asrt.forEach(a => {
					if (typeof assert[a] !== 'function') throw new Error(`test.assert(${a}) is not a method of assert.`);
					describe(descHandler(options.assertFormat, a), function () {
						argsArr.forEach(args => {
							if (!Array.isArray(args)) throw new Error(`test.args has a member of non array.`);
							let expected = args.pop();
							it(descHandler(options.executionFormat, args, expected), function () {
								assertHandler(a, m, thisArg, args, expected, msg);
							});
						});
					});
				});
			});
		});
	});
}

function serializeText (arg, len, lenPos) {
	typeof arg === 'string' && typeof len === 'number' && (arg = smartTruncate(arg, len, lenPos));
	if (typeof arg === 'string') {
		arg = `"${arg}"`;
	} else if (Array.isArray(arg)) {
		arg = arg.map(a => {
			if (Array.isArray(a)) {
				return "[" + serializeText(a, len, lenPos) + "]";
			} else {
				return serializeText(a, len, lenPos);
			}
		}).join(', ');
	} else if (typeof arg === 'function') {
		arg = `[Function: ${arg.name || arg}]`;
	} else if (typeof arg === undefined) {
		arg = "undefined";
	} else if (typeof arg === null) {
		arg = "null";
	}
	return arg;
}

function descHandler (format, ...args) {
	if (typeof format === 'function') {
		return format.apply(format, args);
	} else if (typeof format === 'string') {
		return sprintf.apply(sprintf, [format].concat(args));
	} else {
		return args.join(', ');
	}
}

function callMethod (method, thisArg, args) {
	return method.apply(thisArg, args);
}

function assertHandler (asrt, method, thisArg, args, expected, msg) {
	switch (asrt) {
	case 'ifError':
		assert.ifError(callMethod(method, thisArg, args));
		break;
	case 'ok':
		assert.ok(callMethod(method, thisArg, args), msg);
		break;
	case 'throws':
		assert.throws(
			() => { callMethod(method, thisArg, args); },
			expected
		);
		break;
	case 'doesNotThrow':
		assert.doesNotThrow(
			() => { callMethod(method, thisArg, args); },
			expected
		);
		break;
	default:
		assert[asrt](callMethod(method, thisArg, args), expected, msg);
		break;
	}
}

module.exports = OneMocha;
