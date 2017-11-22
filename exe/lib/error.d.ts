export declare class MyError extends Error {
    readonly status: number;
    constructor(status?: number, message?: string);
}
