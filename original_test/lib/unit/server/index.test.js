const td = require("testdouble");

let subject;
let express;
let routes;

module.exports = {
  beforeEach: () => {
    express = td.replace("../../../../src/wrappers/expressWrapper");
    routes = td.replace("../../../../src/server/routes");
    subject = require("../../../../src/server");
  },
  "Pass app object to the routes function": () => {
    const app = td.object({
      listen: (port, cb) => {},
      use: (cb) => {},
    });
    td.when(express.app()).thenReturn(app);
    td.when();
    subject();
    td.verify(routes(app));
  },
  afterEach: () => {
    td.reset();
  },
};
