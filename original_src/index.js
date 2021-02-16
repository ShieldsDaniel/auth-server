require("dotenv").config();
const connect = require("./db");
const server = require("./server");

connect();
server();
