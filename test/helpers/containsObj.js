const assert = require("assert");
const _ = require("lodash");

const containsObj = (actual, expected) => {
  assert.strictEqual(_.isMatch(actual, expected), true);
};

module.exports = containsObj;
