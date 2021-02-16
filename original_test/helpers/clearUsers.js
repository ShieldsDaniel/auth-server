require("dotenv").config();
const connect = require("../../src/db");
connect(() => {
  const userModel = require("../../src/server/models/user");
  userModel.deleteMany({});
});
