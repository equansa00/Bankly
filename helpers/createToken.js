const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function createToken(username, admin = false) {
  if (!username) {
    throw new Error("Username is required for token generation");
  }
  let payload = { username, admin };
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = createToken;
