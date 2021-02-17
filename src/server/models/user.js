const mongoose = require("mongoose");

/**
 * @typedef { Object.<string, any> } User
 * @property { string } _id
 * @property { string } email
 * @property { string } name
 * @property { string } username
 * @property { string } password
 * @property { string } accessLevel
 * @property { string } appAccess
 */

const accessLevels = {
  NORMAL: "NORMAL",
  ADMIN: "ADMIN",
};

const appAccess = {
  NONE: "NONE",
  ALL: "ALL",
  KNOWLEDGE_BASE: "KNOWLEDGE_BASE",
};

let UserSchema;
let User;

/**
 * @returns { void }
 */
const moduleInit = () => {
  if (!UserSchema) {
    UserSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
      },
      name: { type: String, required: true, minlength: 3, maxlength: 50 },
      username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
      },
      password: { type: String, required: true },
      accessLevel: {
        type: String,
        required: true,
        default: accessLevels.NORMAL,
      },
      appAccess: { type: String, required: true, default: appAccess.NONE },
    });
  }

  if (!User) {
    User = mongoose.model("User", UserSchema);
  }
};

/**
 * @param { Partial<User> } userData
 * @returns { User }
 */
const createUser = (userData) => {
  moduleInit();
  return new User(userData);
};

/**
 * @param { Partial<User> } findOptions
 * @param { User | null }
 */
const findOne = async (findOptions) => {
  moduleInit();
  return User.findOne(findOptions);
};

/**
 * @param { Partial<User> } findOptions
 * @returns { Promise<User[] | null> }
 */
const find = async (findOptions) => {
  moduleInit();
  return User.find(findOptions);
};

const deleteMany = async (findOptions) => {
  moduleInit();
  return User.deleteMany({});
};

module.exports = {
  createUser,
  findOne,
  find,
  deleteMany,
  accessLevels,
};
