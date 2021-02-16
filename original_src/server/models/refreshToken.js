const mongoose = require("mongoose");

let RefreshTokenSchema;
let RefreshToken;

const moduleInit = () => {
  if (!RefreshTokenSchema) {
    RefreshTokenSchema = new mongoose.Schema({
      userId: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 255,
      },
      refreshToken: {
        type: String,
        required: true,
      },
    });
  }
  if (!RefreshToken) {
    RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
  }
};

const createRefreshToken = (refreshTokenData) => {
  moduleInit();
  return new RefreshToken(refreshTokenData);
};

const findOne = async (findOptions) => {
  moduleInit();
  return RefreshToken.find(findOptions);
};

module.exports = {
  createRefreshToken,
  findOne,
};
