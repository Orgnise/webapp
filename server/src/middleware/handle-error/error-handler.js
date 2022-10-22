const chalk = require("chalk");
const ErrorHandler = require("./handle-error");

module.exports = function (options) {
  return function (err, req, res, next) {
    // console.log("❤️‍🔥", chalk.red("[errorHandler]"), "An error occurred: ");

    return ErrorHandler.default.handleError(err, res);
  };
};
