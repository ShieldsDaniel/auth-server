
const checkTokenValidity = (req, res) => {
  const accessToken = req.body.accessToken;
  res.status(200).send({});
};

module.exports = checkTokenValidity;
