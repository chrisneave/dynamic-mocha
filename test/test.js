var expect = require('expect.js');
var util = require('util');

// Multiplcation!
function multiply(x, y) {
  return x * y;
};

// Asynchronous multiplication!
function multiplyAsync(x, y, callback) {
  process.nextTick(function() {
    callback(x * y);
  });
};

var tests = [];

tests.push({
  describe: multiply,
  its: [{
    it: 'can multiple two numbers together',
    expect: 2,
    args: [1, 2]
  }, {
    it: 'handles negative numbers',
    expect: -2,
    args: [1, -2]
  }]
});


tests.push({
  describe: multiplyAsync,
  async: true,
  its: [{
    it: 'can multiple two numbers later :)',
    expect: 2,
    args: [1, 2]
  }]
});

var setupSyncIt = function(test, it_item) {
  return function() {
    expect(test.describe.apply(this, it_item.args)).to.equal(it_item.expect);
  };
};

var setupAsyncIt = function(test, it_item) {
  var args = it_item.args;

  return function(done) {
    args.push(function(result) {
      expect(result).to.equal(it_item.expect);
      done();
    });

    test.describe.apply(this, args);
  };
}

var setupIts = function(test) {
  return function() {
    for (var j = 0; j < test.its.length; j++) {
      it_item = test.its[j];

      if (test.async) {
        it(it_item.it, setupAsyncIt(test, it_item));
      } else {
        it(it_item.it, setupSyncIt(test, it_item));
      }
    }
  };
};

(function() {
  var test;
  var it_item;
  var fn;

  for (var i = 0; i < tests.length; i++) {
    test = tests[i];
    describe('#' + test.describe.name, setupIts(test));
  }
})();

