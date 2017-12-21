const assert = require('assert');

function OneMocha (obj) {
	if (typeof obj !== 'object') throw new Error(`Need object or array`);
	!Array.isArray(obj) && (obj = [obj]);
	obj.forEach(o => {
		let m = o.method,
			desc = o.desc,
			test = o.test;
		if (typeof m !== 'function') throw new Error(`method(${m}) is not a function.`);
		if (desc != null && typeof desc !== 'string') throw new Error(`desc(${desc}) is not a string.`);
		if (typeof test !== 'object') throw new Error(`test needs object or array.`);
		!Array.isArray(test) && (test = [test]);
		describe(desc || `#.${m.name}()`, function () {
			test.forEach(t => {
				let asrt = t.assert,
					msg = t.message,
					argsArr = t.args;
				if (typeof asrt !== 'string' && Array.isArray(asrt)) throw new Error(`test.assert needs object or array.`);
				if (!Array.isArray(argsArr)) throw new Error(`test.args is not an array.`);
				!Array.isArray(asrt) && (asrt = [asrt]);
				asrt.forEach(a => {
					if (typeof assert[a] !== 'function') throw new Error(`test.assert(${a}) is not a method of assert.`);
					argsArr.forEach(args => {
						if (!Array.isArray(args)) throw new Error(`test.args has a member of non array.`);
						let expected = args.pop();
						it(`#.${a}(${args}) => ${expected}`, function () {
							assertHandler(a, m, args, expected, msg);
						});
					});
				});
			});
		});
	});
}

function callMethod (method, args) {
	return method.apply(method, args);
}

function assertHandler (asrt, method, args, expected, msg) {
	switch (asrt) {
	case 'ifError':
		assert.ifError(callMethod(method, args));
		break;
	case 'ok':
		assert.ok(callMethod(method, args), msg);
		break;
	case 'throws':
		assert.throws(
			() => { callMethod(method, args); },
			expected
		);
		break;
	case 'doesNotThrow':
		assert.doesNotThrow(
			() => { callMethod(method, args); },
			expected
		);
		break;
	default:
		assert[asrt](callMethod(method, args), expected, msg);
		break;
	}
}

module.exports = OneMocha;
