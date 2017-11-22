import * as http from 'http';
export class MyError extends Error {
    public readonly status: number;
    constructor(status?: number, message?: string) {
        status = status || 500;
        if (!message) {
            message = http.STATUS_CODES[status];
        }
        super(message);
        // Error.captureStackTrace(this, new.target);
        this.status = status || 500;
    }
}
