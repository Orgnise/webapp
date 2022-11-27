"use strict";

const HttpStatusCode = require("../http-status-code/http-status-code");

module.exports = class ApiResponseHandler {
  static success({
    res,
    data,
    status = HttpStatusCode.OK,
    message,
    dataKey = "data",
    total,
    ...props
  }) {
    const response = {
      message,
      status,
      [dataKey]: data,
      total,
      ...props,
    };
    return res.status(status).json(response);
  }
  static error({ res, message, status, errors, errorCode, props }) {
    const response = {
      message,
      status,
      errors,
      errorCode,
      ...props,
    };
    return res
      .status(status !== null && status !== void 0 ? status : 500)
      .json(response);
  }
};
