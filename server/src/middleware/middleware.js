module.exports = function (options) {
  return function (req, res, next) {
    console.log("🚥:", req.path, "@", new Date().toLocaleTimeString());
    next();
  };
};
