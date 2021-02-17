const jwt = require("../../../wrappers/jwtWrapper");
const refreshTokenModel = require("../../models/refreshToken");

/**
 * @param { Object.<string, any> } user
 * @returns { Promise<Object.<string, any> }
 */
const createTokenPair = async (user) => {
  const accessToken = jwt.sign(
    user.toObject(),
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15min" }
  );
  const refreshToken = jwt.sign(
    user.toObject(),
    process.env.REFRESH_TOKEN_SECRET
  );
  const newRefreshToken = refreshTokenModel.createRefreshToken({
    userId: user._id,
    refreshToken,
  });
  await newRefreshToken.save();
  return {
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      username: user.username,
      name: user.name,
      accessLevel: user.accessLevel,
    },
  };
};

module.exports = createTokenPair;
