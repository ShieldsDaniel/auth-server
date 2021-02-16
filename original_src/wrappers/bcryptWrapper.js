const bcrypt = require("bcrypt");

/**
 * @param { string } data
 * @param { number } saltOrRounds
 * @returns { Promise<string> }
 */
const hash = async (data, saltOrRounds) => {
  return bcrypt.hash(data, saltOrRounds);
};

/**
 * @param { string } savedPassword
 * @param { string } password
 * @returns { Promise<boolean> }
 */
const compare = async (savedPassword, password) => {
  return bcrypt.compare(savedPassword, password);
};

module.exports = { hash, compare };
