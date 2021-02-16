const assert = require("assert");
const containsObj = require("../../../../../helpers/containsObj");
const td = require("testdouble");
const contains = td.matchers.contains;

let subject,
  bcryptWrapper,
  userModel,
  createTokenPair,
  req,
  res,
  result,
  mockUser,
  mockDbUser,
  hashedPass,
  mockAccessToken,
  mockRefreshToken;

module.exports = {
  beforeEach: () => {
    bcryptWrapper = td.replace("../../../../../../src/wrappers/bcryptWrapper");
    userModel = td.replace("../../../../../../src/server/models/user");
    createTokenPair = td.replace(
      "../../../../../../src/server/controllers/userController/createTokenPair"
    );
    subject = require("../../../../../../src/server/controllers/userController/registerNewUser");
    req = {
      body: {
        email: "test@test.com",
        password: "pass123",
        username: "test",
        name: "test",
        app: "TEST_APP",
      },
    };
    res = require("../../../../../helpers/mockRes");
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
  },
  "The registerNewUser function should return 400 error if the email already exists": async () => {
    await td
      .when(userModel.findOne(contains({ email: "test@test.com" })))
      .thenResolve(mockDbUser);
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 400);
    containsObj(result.jsonData, { status: 400, hasError: true });
  },
  "should return 500 error if the bcrypt.hash function fails": async () => {
    await td
      .when(userModel.findOne(contains({ email: "test@test.com" })))
      .thenResolve(null);
    await td.when(bcryptWrapper.hash(req.body.password, 10)).thenReject();
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 500);
    containsObj(result.jsonData, { status: 500, hasError: true });
  },
  "should return 500 error if the mongoose save function fails": async () => {
    const createdUser = td.object({ save: () => {} });
    await td
      .when(userModel.findOne(contains({ email: "test@test.com" })))
      .thenResolve(null);
    await td
      .when(bcryptWrapper.hash(req.body.password, 10))
      .thenResolve(hashedPass);
    td.when(userModel.createUser(mockUser)).thenReturn(createdUser);
    await td.when(createdUser.save()).thenReject();
    result = await subject(req, res);
    assert.strictEqual(result.statusCode, 500);
    containsObj(result.jsonData, { status: 500, hasError: true });
  },
  "should return 201 and an access & refresh token if everything was successful": async () => {
    const createdUser = td.object({
      _id: mockUser._id,
      save: () => {},
      toObject: () => {},
    });
    await td
      .when(userModel.findOne(contains({ email: "test@test.com" })))
      .thenResolve(null);
    await td
      .when(bcryptWrapper.hash(req.body.password, 10))
      .thenResolve(hashedPass);
    td.when(userModel.createUser(mockUser)).thenReturn(createdUser);
    await td.when(createdUser.save()).thenResolve();
    await td.when(createTokenPair(createdUser)).thenReturn({
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
    assert.strictEqual(result.statusCode, 201);
    containsObj(result.jsonData, {
      status: 201,
      hasError: false,
    });
    containsObj(result.jsonData.data, {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  },
  afterEach: () => {
    td.reset();
    res.status(0);
    res.json({});
  },
};
