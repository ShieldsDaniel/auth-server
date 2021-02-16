const jwt = require("jsonwebtoken");
const util = require("util");

/**
 *
 * @param { Partial<User> } user
 * @param { string } tokenOrPrivateKey
 * @param { Object<string, any> } [options]
 * @returns { string }
 */
const sign = (user, tokenOrPrivateKey, options = null) => {
  return jwt.sign(user, tokenOrPrivateKey, options);
};

/**
 *
 * @param { string } token
 * @param { string } tokenOrPublicKey
 * @returns { Promise<Partial<User>> }
 */
const verify = async (token, tokenOrPublicKey) => {
  const verifyAsPromise = util.promisify(jwt.verify);
  return verifyAsPromise(token, tokenOrPublicKey);
};

module.exports = { sign, verify };
