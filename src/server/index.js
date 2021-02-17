const express = require("../wrappers/expressWrapper");
const routes = require("./routes");

const server = () => {
  const app = express.app();
  const port = process.env.PORT || 3000;
  app.use(express.json());
  routes(app);
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

module.exports = server;
