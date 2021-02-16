// @ts-check
const express = require("../wrappers/expressWrapper");
const routes = require("./routes");

const server = () => {
  const app = express.app();
  const port = 3000 || process.env.PORT;
  app.use(express.json());
  routes(app);
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

module.exports = server;
