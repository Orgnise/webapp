var { expressjwt: jwt } = require("express-jwt");
const config = require("../config/auth.config");
const User = require("../models/user");
const RefreshToken = require("../models/refresh-token.model");

module.exports = function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret: config.jwtTokenSecret, algorithms: ["HS256"] }),

    // authorize based on user role
    async (req, res, next) => {
      console.log("🚥:", roles, "@", new Date().toUTCString());
      const user = await User.findById(req.user.id);

      if (!user || (roles.length && !roles.includes(user.role))) {
        // user no longer exists or role not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log("user", user);
      // authenticate and authorization successful
      req.user.role = user.role;
      const refreshToken = await RefreshToken.find({ user: user.id });
      req.user.ownsToken = (token) =>
        !!refreshToken.find((x) => x.token === token);
      next();
    },
  ];
};
