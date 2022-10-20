const jwt = require("jsonwebtoken");
// const { TOKEN_KEY } = require("../config/config");
const { jwtTokenSecret, jwtExpiration } = require("../config/auth.config");

module.exports = function(options) {
  return function(req, res, next) {
    console.log("🚥: Time: ", new Date().toUTCString());
    const token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
      return res
        .status(403)
        .json({ error: "A token is required for authentication" });
    }
    try {
      const decoded = jwt.verify(token, jwtTokenSecret);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Unauthorized! Access Token was expired!");
    }
    return next();
  };
};
