const mongoose = require("mongoose");

const mongoDbHost = process.env.MONGO_DB_HOST;
const mongoDbPort = process.env.MONGO_DB_PORT;

const connect = (cb = () => {}) => {
  mongoose
    .connect(`mongodb://${mongoDbHost}:${mongoDbPort}/authserver`, {
      useNewUrlParser: true,
    })
    .then(() => {
      cb();
      console.log("Connected to MongoDB...");
    })
    .catch((err) => console.error("Could not connect to MongoDb -> " + err));
};
mongoose.connection.on("disconnected", connect);

module.exports = connect;
