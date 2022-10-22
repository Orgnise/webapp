// Define the HTTP status code
export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

// Return error code on the basis of status code
export function ErrorCode(code: HttpStatusCode): string {
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


// Define the error message
// Path: server/src/helper/error-message.ts
export enum ErrorMessage {
    // 400
    BAD_REQUEST = 'Bad request',
    UNAUTHORIZED = 'Unauthorized',
    FORBIDDEN = 'Forbidden',
    NOT_FOUND = 'Not found',
    METHOD_NOT_ALLOWED = 'Method not allowed',
    CONFLICT = 'Conflict',
    UNPROCESSABLE_ENTITY = 'Unprocessable entity',
    // 500
    INTERNAL_SERVER_ERROR = 'Internal server error',
    NOT_IMPLEMENTED = 'Not implemented',
    BAD_GATEWAY = 'Bad gateway',
    SERVICE_UNAVAILABLE = 'Service unavailable',
    GATEWAY_TIMEOUT = 'Gateway timeout',
}

