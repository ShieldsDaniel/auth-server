const td = require("testdouble");

let subject;
let app;
let userController;

module.exports = {
  beforeEach: () => {
    userController = td.replace(
      "../../../../../src/server/controllers/userController"
    );
    app = td.object({
      post: () => {},
    });
    subject = require("../../../../../src/server/routes");
  },
  "Add /user/register route to the express app object using the registerNewUser() method of the userController": () => {
    subject(app);
    td.verify(app.post("/user/register", userController.registerNewUser));
  },
  "Add /user/login route to the express app object using the loginUser() method of the userController": () => {
    subject(app);
    td.verify(app.post("/user/login", userController.loginUser));
  },
  "Add /user/token route to the express app object using the getNewAccessToken() method of the userController": () => {
    subject(app);
    td.verify(app.post("/user/token", userController.getNewAccessToken));
  },
  afterEach: () => {
    td.reset();
  },
};
