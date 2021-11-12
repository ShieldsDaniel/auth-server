const mongoose = require("mongoose");

const mongoDbHost = process.env.MONGO_DB_HOST;
const mongoDbPort = process.env.MONGO_DB_PORT;

let dbConnected = false;

const connect = async (cb = () => { }) => {
  if (!dbConnected) {
    try {
      await mongoose
        .connect(`mongodb://${mongoDbHost}:${mongoDbPort}/authserver`, {
          useNewUrlParser: true,
        })
      cb();
      console.log("Connected to MongoDB...");
    } catch (err) {
      console.error("Could not connect to MongoDb -> " + err)
    }
  }
};

module.exports = connect;
