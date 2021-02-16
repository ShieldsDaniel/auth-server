// @ts-check
const userModel = require("../../models/user");
const bcrypt = require("../../../wrappers/bcryptWrapper");
const createTokenPair = require("./createTokenPair");

/**
 * @param { import("express").Request } req
 * @param { import("express").Response } res
 * @returns { Promise<import("express").Response> }
 */
const loginUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({
        status: 400,
        hasError: true,
        data: {},
        errorMessage: "Email or password is incorrect",
      });
    }
    const returnData = await createTokenPair(user);
    return res.status(200).json({
      status: 200,
      hasError: false,
      data: returnData,
      errorMessage: "",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      hasError: true,
      data: {},
      errorMessage: "An unexpected error has occurred",
    });
  }
};

module.exports = loginUser;
