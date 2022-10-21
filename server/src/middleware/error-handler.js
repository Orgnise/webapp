const chalk = require("chalk");

module.exports = function (options) {
  return function (err, req, res, next) {
    console.log("❤️‍🔥", chalk.red("[errorHandler]"), "An error occurred: ");
    const { code, status, inner } = err;
    console.log("❤️‍🔥", chalk.red("[errorHandler]"), "code:", err);
    // console.log(chalk.red("code: "), code);
    // console.log(chalk.red("status: ") + status);
    // console.log(chalk.red("inner: "), inner);

    switch (true) {
      case typeof err === "string":
        // custom application error
        const is404 = err.toLowerCase().endsWith("not found");
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
      case typeof err?.status === "number":
        // custom application error
        return res
          .status(err.status)
          .json({ message: err.message, error: err.error });
      case err?.name === "ValidationError":
        // mongoose validation errorcredentials_required
        return res.status(400).json({ message: err.message });
      case err?.name === "UnauthorizedError":
        // jwt authentication error
        return res.status(401).json({ message: "Unauthorized" });
      default:
        return res.status(500).json({ message: err.message });
    }
    // return res.status(500).json({ message: err.message });
  };
};
