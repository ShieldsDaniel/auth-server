const assert = require("assert");
const td = require("testdouble");
const containsObj = require("../../../../../helpers/containsObj");

process.env.ACCESS_TOKEN_SECRET = "1234";
process.env.REFRESH_TOKEN_SECRET = "4321";

let subject, result, req, res, mockUser, refreshTokenModel, jwtWrapper;

module.exports = {
  beforeEach: () => {
    refreshTokenModel = td.replace(
      "../../../../../../src/server/models/refreshToken"
    );
    jwtWrapper = td.replace("../../../../../../src/wrappers/jwtWrapper");
    res = require("../../../../../helpers/mockRes");
    subject = require("../../../../../../src/server/controllers/userController/getNewAccessToken");
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
  },
  "should return 401 error if no refresh token was sent": async () => {
    req = { body: { token: null } };
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 401);
    containsObj(result.jsonData, { status: 401, hasError: true });
  },
  "should return 403 error if refresh token is not saved in the database": async () => {
    req = { body: { token: mockRefreshToken } };
    await td
      .when(refreshTokenModel.findOne({ refreshToken: mockRefreshToken }))
      .thenResolve(false);
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 403);
    containsObj(result.jsonData, { status: 403, hasError: true });
  },
  "should return 500 error if jwt.verify function rejects": async () => {
    req = { body: { token: mockRefreshToken } };
    await td
      .when(refreshTokenModel.findOne({ refreshToken: mockRefreshToken }))
      .thenResolve(true);
    await td
      .when(
        jwtWrapper.verify(mockRefreshToken, process.env.REFRESH_TOKEN_SECRET)
      )
      .thenReject();
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 500);
    containsObj(result.jsonData, { status: 500, hasError: true });
  },
  "should return 200 and a new access token if everything was successful": async () => {
    req = { body: { token: mockRefreshToken } };
    await td
      .when(refreshTokenModel.findOne({ refreshToken: mockRefreshToken }))
      .thenResolve(true);
    await td
      .when(
        jwtWrapper.verify(mockRefreshToken, process.env.REFRESH_TOKEN_SECRET)
      )
      .thenResolve(mockUser);
    await td
      .when(
        jwtWrapper.sign(mockUser, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15min",
        })
      )
      .thenResolve(mockAccessToken);
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 200);
    containsObj(result.jsonData, { status: 200, hasError: false });
    containsObj(result.jsonData.data, { accessToken: mockAccessToken });
    assert.strictEqual(result.jsonData.data.accessToken, mockAccessToken);
  },
  afterEach: () => {
    td.reset();
    res.jsonData = {};
    res.statusCode = 0;
  },
};
