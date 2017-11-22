export interface IErrorData {
    innerError?: IErrorData;
    status?: number;
    message: string;
    details?: any;
    stack?: string;
}
export declare class MyError extends Error {
    static getDefaultMessage(code?: number): string;
    static toErrorData(err: any): IErrorData;
    private static getCode(code?);
    private static getArgs(args);
    readonly status: number;
    readonly innerError: any;
    readonly details: any;
    constructor(status?: number, message?: string);
    constructor(innerError: any, status?: number, message?: string, details?: any);
    constructor(innerError: any, message: string, details?: any);
}
export interface IErrorConstructorArgs {
    status: number;
    message: string;
    innerError: any;
    details: any;
}
