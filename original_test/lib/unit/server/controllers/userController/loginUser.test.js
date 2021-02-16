const assert = require("assert");
const containsObj = require("../../../../../helpers/containsObj");
const td = require("testdouble");
const contains = td.matchers.contains;

let subject, bcryptWrapper, userModel, req, res, result, createTokenPair;

module.exports = {
  beforeEach: () => {
    bcryptWrapper = td.replace("../../../../../../src/wrappers/bcryptWrapper");
    userModel = td.replace("../../../../../../src/server/models/user");
    createTokenPair = td.replace(
      "../../../../../../src/server/controllers/userController/createTokenPair"
    );
    subject = require("../../../../../../src/server/controllers/userController/loginUser");
    req = {
      body: {
        email: "test@test.com",
        password: "pass123",
        app: "TEST_APP",
      },
    };
    hashedPass = "slkj23lkjsoci23lkj";
    mockDbUser = {
      _id: "2398sdkjfhlskjdf",
      email: "test@test.com",
      username: "test",
      name: "test",
      password: "29387slkdjfo",
      accessLevel: "NONE",
      appAccess: "NONE",
    };
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
    res = require("../../../../../helpers/mockRes");
  },
  "should return 400 error if the user does not exists": async () => {
    await td
      .when(userModel.findOne(contains({ email: "test@test.com" })))
      .thenResolve(null);
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 400);
    containsObj(result.jsonData, { status: 400, hasError: true });
  },
  "should return 400 error if the bcrypt.compare function fails": async () => {
    await td
      .when(userModel.findOne(contains({ email: "test@test.com" })))
      .thenResolve(mockDbUser);
    await td
      .when(bcryptWrapper.compare(mockDbUser.password, req.password))
      .thenResolve(false);
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 400);
    containsObj(result.jsonData, { status: 400, hasError: true });
  },
  "should return 500 if one of the promises rejects": async () => {
    await td
      .when(userModel.findOne(contains({ email: "test@test.com" })))
      .thenReject();
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 500);
    containsObj(result.jsonData, { status: 500, hasError: true });
  },
  "should return 200 and an access & refresh token if everything was successful": async () => {
    const foundUser = td.object({
      ...mockDbUser,
      save: () => {},
      toObject: () => {},
    });
    await td
      .when(userModel.findOne(contains({ email: "test@test.com" })))
      .thenResolve(foundUser);
    await td
      .when(bcryptWrapper.compare(req.body.password, mockDbUser.password))
      .thenResolve(true);
    await td.when(createTokenPair(foundUser)).thenReturn({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: {
        _id: mockUser._id,
        email: mockUser.email,
        username: mockUser.user,
        name: mockUser.name,
        accesssLevel: mockUser.accessLevel,
      },
    });
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 200);
    containsObj(result.jsonData, { status: 200, hasError: false });
    containsObj(result.jsonData.data, {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  },
  afterEach: () => {
    td.reset();
    res.jsonData = {};
    res.statusCode = 0;
  },
};
