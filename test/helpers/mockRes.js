module.exports = {
  jsonData: {},
  json(jsonData) {
    this.jsonData = jsonData;
    return this;
  },
  statusCode: 0,
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
};
