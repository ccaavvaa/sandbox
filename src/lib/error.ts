import * as http from 'http';
export interface IErrorData {
    innerError?: IErrorData;
    status?: number;
    message: string;
    details?: any;
    stack?: string;
}
export class MyError extends Error {
    public static getDefaultMessage(code?: number) {
        code = code || 500;
        return http.STATUS_CODES[code];
    }
    public static toErrorData(err: any): IErrorData {
        if (err instanceof MyError) {
            const data: IErrorData = {
                status: err.status,
                stack: err.stack,
                message: err.message,
            };
            if (err.innerError) {
                data.innerError = MyError.toErrorData(err.innerError);
            }
            if (err.details) {
                data.details = err.details;
            }
            return data;
        }
        if (err instanceof Error) {
            const data: IErrorData = {
                status: 500,
                stack: err.stack,
                message: err.message || MyError.getDefaultMessage(),
            };
            return data;
        }
        if (err) {
            const data: IErrorData = {
                status: 500,
                message: err.toString(),
            };
            return data;
        } else {
            return {
                status: 500,
                message: MyError.getDefaultMessage(),
            };
        }
    }

    private static getCode(code?: number) {
        code = code || 500;
        return MyError.getDefaultMessage(code) ? code : 500;
    }
    private static getArgs(args: any[]): IErrorConstructorArgs {
        let status: number;
        let message: string;
        let innerError: any;
        let details: any;

        if (args && args.length) {
            let p1 = args[0];
            if ((p1 instanceof Error) || ((typeof p1 !== 'number') && args.length >= 3) || args.length >= 4) {
                innerError = p1;
                args.splice(0, 1);
            }
            if (args.length === 0) {
                status = 500;
            } else if (typeof args[0] === 'number') {
                status = args[0] || 500;
                args.splice(0, 1);
            } else {
                status = 500;
            }

            if (args.length > 0) {
                p1 = args[0];
                if (typeof (p1) === 'string') {
                    message = p1;
                    if (args.length > 1) {
                        details = args[1];
                    }
                } else {
                    details = p1;
                }
            }
        }
        status = status || 500;
        message = message || MyError.getDefaultMessage(status);
        return { status, message, innerError, details };
    }
    public readonly status: number;
    public readonly innerError: any;
    public readonly details: any;
    constructor(status?: number, message?: string);
    constructor(innerError: any, status?: number, message?: string, details?: any);
    constructor(innerError: any, message: string, details?: any);
    constructor(...args: any[]) {
        const info = MyError.getArgs(args);
        super(info.message);
        this.status = info.status;
        this.innerError = info.innerError;
        this.details = info.details;
    }
}

export interface IErrorConstructorArgs {
    status: number;
    message: string;
    innerError: any;
    details: any;
}
