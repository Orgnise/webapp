"use strict";

module.exports = class HttpStatusCode {
  static OK = 200;
  static CREATED = 201;
  static ACCEPTED = 202;
  static NO_CONTENT = 204;

  static BAD_REQUEST = 400;
  static UNAUTHORIZED = 401;
  static FORBIDDEN = 403;
  static NOT_FOUND = 404;
  static UNPROCESSABLE_ENTITY = 422;
  static TOO_MANY_REQUESTS = 429;
  static INTERNAL_SERVER_ERROR = 500;
  static GATEWAY_TIMEOUT = 504;

  static ErrorCode = (status) => {
    switch (status) {
      case HttpStatusCode.OK:
        return "OK";
      case HttpStatusCode.CREATED:
        return "CREATED";
      case HttpStatusCode.ACCEPTED:
        return "ACCEPTED";
      case HttpStatusCode.NO_CONTENT:
        return "NO_CONTENT";
      case HttpStatusCode.BAD_REQUEST:
        return "BAD_REQUEST";
      case HttpStatusCode.UNAUTHORIZED:
        return "UNAUTHORIZED";
      case HttpStatusCode.FORBIDDEN:
        return "FORBIDDEN";
      case HttpStatusCode.NOT_FOUND:
        return "NOT_FOUND";
      case HttpStatusCode.CONFLICT:
        return "CONFLICT";
      case HttpStatusCode.UNPROCESSABLE_ENTITY:
        return "UNPROCESSABLE_ENTITY";
      case HttpStatusCode.TOO_MANY_REQUESTS:
        return "TOO_MANY_REQUESTS";
      case HttpStatusCode.GATEWAY_TIMEOUT:
        return "GATEWAY_TIMEOUT";
      default:
        return "INTERNAL_SERVER_ERROR";
    }
  };

  static ErrorMessage = {
    OK: "OK",
    CREATED: "Created",
    ACCEPTED: "Accepted",
    NO_CONTENT: "No Content",
    BAD_REQUEST: "Bad request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not found",
    CONFLICT: "Conflict",
    UNPROCESSABLE_ENTITY: "Unprocessable entity",
    TOO_MANY_REQUESTS: "Too many requests",
    GATEWAY_TIMEOUT: "Gateway timeout",
    INTERNAL_SERVER_ERROR: "Internal server error",
  };

  static HttpStatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    GATEWAY_TIMEOUT: 504,
    INTERNAL_SERVER_ERROR: 500,
  };
};
