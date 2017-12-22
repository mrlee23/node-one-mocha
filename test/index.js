const oneMocha = require('../index.js'),
	  path = require('path');

const simple1 = {
	method: () => true,
	test: {
		assert: 'equal',
		args: [[true]]
	}
};
const simple2 = {
	method: (arg) => typeof arg === 'string',
	test: {
		assert: 'equal',
		args: [["A", true],
			   ["B", true],
			   [1, false]]
	}
};

const complex1 =
	  [{
		  method: () => { return {a: true, b: false};},
		  desc: "This is sample",
		  name: "Complex1-1",
		  test: {
			  assert: 'deepEqual',
			  args: [[{a: true, b: false}]]
		  }},
	   {
		   method: () => 1,
		   name: "Complex1-2",
		   test:
		   [
			   {
				   assert: 'equal',
				   args: [[1]]
			   },
			   {
				   assert: 'notEqual',
				   args: [[2]]
			   }
		   ]
	   }];

const typeErrTester = [{
	method: oneMocha,
	name: "oneMochaTest",
	test: [{assert: 'throws',
			args: [["Asaldkfjsdalfjsdalfjsladkfjldksafjlasdfjakldsj", Error],
				   [1, Error],
				   [{}, Error],
				   [{method: () => {},
					 test: {}}, Error],
				   [{method: () => {},
					 test: {
						 assert: 'notExistName'
					 }}, Error]]
		   },
		   {
			   assert: 'doesNotThrow',
			   message : {name:"HI"},
			   args: [[simple1, undefined],
					  [simple2, undefined],
					  [complex1, undefined]]
		   }]
}];
oneMocha(typeErrTester);
