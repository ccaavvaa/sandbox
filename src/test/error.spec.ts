// tslint:disable:only-arrow-functions
// tslint:disable-next-line:no-implicit-dependencies
import * as chai from 'chai';
import './debug-test';
// tslint:disable-next-line:no-implicit-dependencies
import 'mocha';
import { MyError } from '../lib/error';

const expect = chai.expect;
// const assert = chai.assert;

function throwMyError(status?: number, message?: string): void {
    throw new MyError(status, message);
}

describe('MyError', function () {

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
});
