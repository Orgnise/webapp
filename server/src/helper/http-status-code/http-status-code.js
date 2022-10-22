"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = exports.ErrorCode = exports.HttpStatusCode = void 0;
// Define the HTTP status code
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["CREATED"] = 201] = "CREATED";
    HttpStatusCode[HttpStatusCode["ACCEPTED"] = 202] = "ACCEPTED";
    HttpStatusCode[HttpStatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCode[HttpStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCode[HttpStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpStatusCode[HttpStatusCode["CONFLICT"] = 409] = "CONFLICT";
    HttpStatusCode[HttpStatusCode["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatusCode[HttpStatusCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HttpStatusCode[HttpStatusCode["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpStatusCode[HttpStatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    HttpStatusCode[HttpStatusCode["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
})(HttpStatusCode = exports.HttpStatusCode || (exports.HttpStatusCode = {}));
// Return error code on the basis of status code
function ErrorCode(code) {
    switch (code) {
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
        case HttpStatusCode.METHOD_NOT_ALLOWED:
            return "METHOD_NOT_ALLOWED";
        case HttpStatusCode.CONFLICT:
            return "CONFLICT";
        case HttpStatusCode.UNPROCESSABLE_ENTITY:
            return "UNPROCESSABLE_ENTITY";
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
            return "INTERNAL_SERVER_ERROR";
        case HttpStatusCode.NOT_IMPLEMENTED:
            return "NOT_IMPLEMENTED";
        case HttpStatusCode.BAD_GATEWAY:
            return "BAD_GATEWAY";
        case HttpStatusCode.SERVICE_UNAVAILABLE:
            return "SERVICE_UNAVAILABLE";
        case HttpStatusCode.GATEWAY_TIMEOUT:
            return "GATEWAY_TIMEOUT";
        default:
            return "UNPROCESSABLE_ENTITY";
    }
}
exports.ErrorCode = ErrorCode;
// Define the error message
// Path: server/src/helper/error-message.ts
var ErrorMessage;
(function (ErrorMessage) {
    // 400
    ErrorMessage["BAD_REQUEST"] = "Bad request";
    ErrorMessage["UNAUTHORIZED"] = "Unauthorized";
    ErrorMessage["FORBIDDEN"] = "Forbidden";
    ErrorMessage["NOT_FOUND"] = "Not found";
    ErrorMessage["METHOD_NOT_ALLOWED"] = "Method not allowed";
    ErrorMessage["CONFLICT"] = "Conflict";
    ErrorMessage["UNPROCESSABLE_ENTITY"] = "Unprocessable entity";
    // 500
    ErrorMessage["INTERNAL_SERVER_ERROR"] = "Internal server error";
    ErrorMessage["NOT_IMPLEMENTED"] = "Not implemented";
    ErrorMessage["BAD_GATEWAY"] = "Bad gateway";
    ErrorMessage["SERVICE_UNAVAILABLE"] = "Service unavailable";
    ErrorMessage["GATEWAY_TIMEOUT"] = "Gateway timeout";
})(ErrorMessage = exports.ErrorMessage || (exports.ErrorMessage = {}));
