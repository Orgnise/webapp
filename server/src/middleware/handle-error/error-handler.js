const chalk = require("chalk");
const { NextFunction, Request, Response } = require("express");
const HttpStatusCode = require("../../helper/http-status-code/http-status-code");

module.exports = function (options) {
  return function (err, req, res, next) {
    console.log("❤️‍🔥", chalk.red("[errorHandler]"), err);

    const status = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
    const errorCode = err.errorCode || HttpStatusCode.ErrorCode(status);
    const message =
      err.message ||
      HttpStatusCode.ErrorMessage[errorCode] ||
      HttpStatusCode.ErrorMessage.INTERNAL_SERVER_ERROR;
    const error = err.error;

    return res.status(status).json({
      status,
      errorCode,
      message,
      error,
    });
  };
};
