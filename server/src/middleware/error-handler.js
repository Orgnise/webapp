module.exports = function (options) {
  return function (err, req, res, next) {
    console.error("❤️‍🔥 [errorHandler] An error occurred: ", err);
    switch (true) {
      case typeof err === "string":
        // custom application error
        const is404 = err.toLowerCase().endsWith("not found");
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
      case err?.name === "ValidationError":
        // mongoose validation error
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
