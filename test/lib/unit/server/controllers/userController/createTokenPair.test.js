const td = require("testdouble");

process.env.ACCESS_TOKEN_SECRET = "1234";
process.env.REFRESH_TOKEN_SECRET = "4321";

let subject,
  result,
  jwtWrapper,
  refreshTokenModel,
  mockUser,
  mockAccessToken,
  mockRefreshToken;

module.exports = {
  beforeEach: () => {
    jwtWrapper = td.replace("../../../../../../src/wrappers/jwtWrapper");
    refreshTokenModel = td.replace(
      "../../../../../../src/server/models/refreshToken"
    );
    hashedPass = "slkj23lkjsoci23lkj";
    mockUser = {
      email: "test@test.com",
      username: "test",
      name: "test",
      password: hashedPass,
      accessLevel: "NORMAL",
      appAccess: "TEST_APP",
    };
    mockAccessToken = "slsl23lkd.dslk2lkjsd.2l3kjflkjsldkfjlkjsd";
    mockRefreshToken = "slkdjf829.2398sldjfl.2983sodfjlk298dkjhg8";
    subject = require("../../../../../../src/server/controllers/userController/createTokenPair");
  },
  "Should create an accessToken/refreshToken pair": async () => {
    const createdUser = td.object({
      _id: mockUser._id,
      save: () => { },
      toObject: () => { },
    });
    const createdRefreshToken = td.object({ save: () => { } });
    td.when(createdUser.toObject()).thenReturn(mockUser);
    td.when(
      jwtWrapper.sign(mockUser, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15min",
      })
    ).thenReturn(mockAccessToken);
    td.when(
      jwtWrapper.sign(mockUser, process.env.REFRESH_TOKEN_SECRET)
    ).thenReturn(mockRefreshToken);
    await td
      .when(
        refreshTokenModel.createRefreshToken({
          userId: createdUser._id,
          refreshToken: mockRefreshToken,
        })
      )
      .thenReturn(createdRefreshToken);
    result = await subject(createdUser);
    await td.verify(createdRefreshToken.save());
  },
  afterEach: () => { },
};
