interface ApiResponse<T> {
    message?: string;
    errorCode?: string;
    status?: number;
    data?: T;
    errors?: Array<any>;
}

interface ErrorInterface {
    res: any;
    message: string;
    status: number;
    errorCode: string;
    errors?: Array<any>;
}
interface rawInterface {
    res: any;
    message: string;
    status: number;
    errorCode: string;
    errors?: Array<any>;
    data?: any,
}

// Class to handle the response from the API
// Path: server/src/helper/api-response.ts
export default class ApiResponseHandler {
    public static response<T>(res: any, data: T, status = 200, message?: string) {
        const response: ApiResponse<T> = {
            message,
            status,
            data,
        };

        return res.status(status).json(response);
    }



    public static error({ res, message, status, errors, errorCode }: ErrorInterface) {
        const response: ApiResponse<any> = {
            message,
            status,
            errors,
            errorCode
        };

        return res.status(status ?? 500).json(response);
    }

}