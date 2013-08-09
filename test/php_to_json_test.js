'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.php_to_json = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  defaultOptions: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/data.js');
    var expected = grunt.file.read('test/expected/data.js');
    test.equal(actual, expected, 'File just with JSON-content');

    test.done();
  },
  withWrapper: function(test) {
    test.expect(1);
    var testData = "";
    var someFunc = function(dataIn){
      testData = dataIn[2]["name"];
    }
    eval( grunt.file.read('tmp/withWrapper.js') );  // read and run

    test.equal(testData, "Paula", 'File must call callback function inside it with JSON in parameters');

    test.done();
  },
  withContentProcess: function(test) {
    test.expect(2);
    var moduleName = "";
    var testData = "";
    var define = function(name, callback){
      moduleName = name;
      testData = callback()[2]["name"];
    }
    eval( grunt.file.read('tmp/withContentProcess.js') );  // read and run

    test.equal(moduleName, "data", 'Module name must be `data`');
    test.equal(testData, "Paula", 'File must provide AMD module accordingly contentProcess template');

    test.done();
  },
};
