// tslint:disable:only-arrow-functions
// tslint:disable-next-line:no-implicit-dependencies
import * as chai from 'chai';
import './debug-test';
// tslint:disable-next-line:no-implicit-dependencies
import 'mocha';
import { MyError, IErrorConstructorArgs, IErrorData } from '../lib/error';

const expect = chai.expect;
// const assert = chai.assert;

function throwMyError(status?: number, message?: string): void {
    throw new MyError(status, message);
}

describe('MyError', function () {
    it('constructor args', function () {
        const getArgs: (...args: any[]) => IErrorConstructorArgs = (MyError as any).getArgs;
        const error = new Error('error');
        const testData: Array<{ args: any[], expected: IErrorConstructorArgs, message?: string }> = [
            {
                args: [error, 400, 'msg', 'details'],
                expected: {
                    status: 400,
                    message: 'msg',
                    details: 'details',
                    innerError: error,
                },
            },
            {
                args: [],
                expected: {
                    status: 500,
                    message: 'Internal Server Error',
                    details: undefined,
                    innerError: undefined,
                },
            },
            {
                args: [401],
                expected: {
                    status: 401,
                    message: 'Unauthorized',
                    details: undefined,
                    innerError: undefined,
                },
            },
            {
                args: ['err'],
                expected: {
                    status: 500,
                    message: 'err',
                    details: undefined,
                    innerError: undefined,
                },
            },
            {
                args: ['msg', 'details'],
                expected: {
                    status: 500,
                    message: 'msg',
                    details: 'details',
                    innerError: undefined,
                },
            },
            {
                args: [error, 'msg', 'details'],
                expected: {
                    status: 500,
                    message: 'msg',
                    details: 'details',
                    innerError: error,
                },
            },
            {
                args: [error, 'msg', 'details'],
                expected: {
                    status: 500,
                    message: 'msg',
                    details: 'details',
                    innerError: error,
                },
            },
        ];
        for (const t of testData) {
            const r = getArgs(t.args);
            expect(r).eql(t.expected, t.message || t.args.join(','));
        }
    });
    it('constructor without arg', function () {
        const error = new MyError();
        expect(error instanceof Error).to.be.true;
        expect(error.status).equals(500);
        expect(error.message).eql('Internal Server Error');
    });
    it('constructor with status', function () {
        const error = new MyError(401);
        expect(error instanceof Error).to.be.true;
        expect(error.status).equals(401);
        expect(error.message).eql('Unauthorized');
    });
    it('stacktrace', function () {
        try {
            throwMyError(500);
        } catch (e) {
            if (e instanceof MyError) {
                expect(e.stack.startsWith('Error: Internal Server Error\n    at throwMyError')).to.be.true;
            } else {
                throw e;
            }
        }
    });
    it('errorData sans stack', function () {
        const error = new Error('error');
        const myError = new MyError(error, 401, 'myMsg', 'details');
        const testData: Array<{ err: any, expected: IErrorData, message?: string }> = [
            {
                err: '',
                expected: {
                    status: 500,
                    message: MyError.getDefaultMessage(),
                },
            },
            {
                err: error,
                expected: {
                    status: 500,
                    message: error.message,
                },
            },
            {
                err: myError,
                expected: {
                    status: 401,
                    message: 'myMsg',
                    details: 'details',
                    innerError: {
                        status: 500,
                        message: error.message,
                    },
                },
            },
        ];
        for (const t of testData) {
            const r = MyError.toErrorData(t.err);
            let x = r;
            while (x) {
                delete x.stack;
                x = x.innerError;
            }

            expect(r).eql(t.expected, t.message || t.err);
        }
    });
});
