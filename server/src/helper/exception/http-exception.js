"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(errorCode, message, error) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
        this.error = error || null;
    }
}
exports.default = HttpException;
