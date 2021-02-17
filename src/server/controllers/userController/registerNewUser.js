const userModel = require("../../models/user");
const bcrypt = require("../../../wrappers/bcryptWrapper");
const createTokenPair = require("./createTokenPair");

/**
 * @param { import("express").Request } req
 * @param { import("express").Response } res
 * @returns { Promise<import("express").Response> }
 */
const registerNewUser = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        status: 400,
        hasError: true,
        data: {},
        errorMessage: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user = userModel.createUser({
      email: req.body.email,
      username: req.body.username,
      name: req.body.name,
      password: hashedPassword,
      accessLevel: userModel.accessLevels.NORMAL,
      appAccess: req.body.app,
    });
    await user.save();
    const returnData = await createTokenPair(user);
    return res.status(201).json({
      status: 201,
      hasError: false,
      data: returnData,
      errorMessage: "",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      hasError: true,
      data: {},
      errorMessage: "An error has occurred",
    });
  }
};

module.exports = registerNewUser;
