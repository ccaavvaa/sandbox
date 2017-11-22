"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
class MyError extends Error {
    static getDefaultMessage(code) {
        code = code || 500;
        return http.STATUS_CODES[code];
    }
    static toErrorData(err) {
        if (err instanceof MyError) {
            const data = {
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
            const data = {
                status: 500,
                stack: err.stack,
                message: err.message || MyError.getDefaultMessage(),
            };
            return data;
        }
        if (err) {
            const data = {
                status: 500,
                message: err.toString(),
            };
            return data;
        }
        else {
            return {
                status: 500,
                message: MyError.getDefaultMessage(),
            };
        }
    }
    static getCode(code) {
        code = code || 500;
        return MyError.getDefaultMessage(code) ? code : 500;
    }
    static getArgs(args) {
        let status;
        let message;
        let innerError;
        let details;
        if (args && args.length) {
            let p1 = args[0];
            if ((p1 instanceof Error) || ((typeof p1 !== 'number') && args.length >= 3) || args.length >= 4) {
                innerError = p1;
                args.splice(0, 1);
            }
            if (args.length === 0) {
                status = 500;
            }
            else if (typeof args[0] === 'number') {
                status = args[0] || 500;
                args.splice(0, 1);
            }
            else {
                status = 500;
            }
            if (args.length > 0) {
                p1 = args[0];
                if (typeof (p1) === 'string') {
                    message = p1;
                    if (args.length > 1) {
                        details = args[1];
                    }
                }
                else {
                    details = p1;
                }
            }
        }
        status = status || 500;
        message = message || MyError.getDefaultMessage(status);
        return { status, message, innerError, details };
    }
    constructor(...args) {
        const info = MyError.getArgs(args);
        super(info.message);
        this.status = info.status;
        this.innerError = info.innerError;
        this.details = info.details;
    }
}
exports.MyError = MyError;

//# sourceMappingURL=error.js.map
