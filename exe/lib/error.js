"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
class MyError extends Error {
    constructor(status, message) {
        status = status || 500;
        if (!message) {
            message = http.STATUS_CODES[status];
        }
        super(message);
        this.status = status || 500;
    }
}
exports.MyError = MyError;

//# sourceMappingURL=error.js.map
