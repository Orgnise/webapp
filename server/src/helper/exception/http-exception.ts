export default class HttpException extends Error {
    errorCode?: string;
    status?: number;
    message: string;
    error: string | null;

    constructor(errorCode: string, message: string, error?: string) {
        super(message);

        this.errorCode = errorCode;
        this.message = message;
        this.error = error || null;
    }
}