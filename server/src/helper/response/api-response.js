"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Class to handle the response from the API
// Path: server/src/helper/api-response.ts
class ApiResponseHandler {
    static response(res, data, status = 200, message) {
        const response = {
            message,
            status,
            data,
        };
        return res.status(status).json(response);
    }
    static error({ res, message, status, errors, errorCode }) {
        const response = {
            message,
            status,
            errors,
            errorCode
        };
        return res.status(status !== null && status !== void 0 ? status : 500).json(response);
    }
}
exports.default = ApiResponseHandler;
