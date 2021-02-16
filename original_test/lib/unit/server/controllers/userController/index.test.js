const td = require("testdouble");
const assert = require("assert");

module.exports = {
  "should retrieve all dependencies and create an object of functions": () => {
    const registerNewUser = td.replace(
      "../../../../../../src/server/controllers/userController/registerNewUser"
    );
    const loginUser = td.replace(
      "../../../../../../src/server/controllers/userController/loginUser"
    );
    const getNewAccessToken = td.replace(
      "../../../../../../src/server/controllers/userController/getNewAccessToken"
    );
    const subject = require("../../../../../../src/server/controllers/userController");

    assert.strictEqual(subject.hasOwnProperty("registerNewUser"), true);
    assert.strictEqual(typeof subject.registerNewUser, "function");
    assert.strictEqual(subject.hasOwnProperty("loginUser"), true);
    assert.strictEqual(typeof subject.loginUser, "function");
    assert.strictEqual(subject.hasOwnProperty("getNewAccessToken"), true);
    assert.strictEqual(typeof subject.getNewAccessToken, "function");

    td.reset();
  },
};
