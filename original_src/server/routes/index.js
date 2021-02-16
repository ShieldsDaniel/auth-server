// @ts-check
const userController = require("../controllers/userController");

/**
 * @param { import("express-serve-static-core").Express } app
 * @returns { void }
 */
const routes = (app) => {
  app.post("/user/register", userController.registerNewUser);
  app.post("/user/login", userController.loginUser);
  app.post("/user/token", userController.getNewAccessToken);
};

module.exports = routes;
