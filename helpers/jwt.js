const jwt = require("jsonwebtoken");

const signToken = (payload, secret, options = {}) => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = { signToken, verifyToken, decodeToken };
