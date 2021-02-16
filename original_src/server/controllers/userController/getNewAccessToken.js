// @ts-check
const refreshTokenModel = require("../../models/refreshToken");
const jwt = require("../../../wrappers/jwtWrapper");

/**
 * @param { import("express").Request } req
 * @param { import("express").Response } res
 * @returns { Promise<import("express").Response> }
 */
const getNewAccessToken = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        data: {},
        hasError: true,
        errorMessage: "Refresh token required",
      });
    }
    if (!(await refreshTokenModel.findOne({ refreshToken }))) {
      return res.status(403).json({
        status: 403,
        data: {},
        hasError: true,
        errorMessage: "Refresh token is not valid",
      });
    }
    const user = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const accessToken = await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15min",
    });
    return res.status(200).json({
      status: 200,
      data: {
        accessToken,
      },
      hasError: false,
      errorMessage: "",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      data: {},
      hasError: true,
      errorMessage: "An error has occurred",
    });
  }
};

module.exports = getNewAccessToken;
