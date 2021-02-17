require("dotenv").config();
const server = require("./server");
const connect = require("./db");

(async () => {
  server();
  connect();
})();
