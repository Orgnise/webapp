const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = require("../config/config");

module.exports = function(options) {
  return function(req, res, next) {
    console.log("🚥: Time: ", new Date().toUTCString());
    const token = req.headers["x-access-token"];

    if (!token) {
      return res
        .status(403)
        .send({ error: "A token is required for authentication" });
    }
    try {
      const decoded = jwt.verify(token, TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };
};
