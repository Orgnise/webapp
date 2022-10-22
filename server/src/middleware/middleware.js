const chalk = require("chalk");

module.exports = function (options) {
  return function (req, res, next) {
    console.log("🚥:", chalk.red("Initiate API REQUEST"), chalk.blue(req.path));
    next();
  };
};
