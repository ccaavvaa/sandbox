// tslint:disable:only-arrow-functions
// tslint:disable-next-line:no-implicit-dependencies
import * as chai from 'chai';
import './debug-test';
// tslint:disable-next-line:no-implicit-dependencies
import 'mocha';
import { HRTime, HRTimeTools } from '../lib/hrtime';
import { equal } from 'assert';

const expect = chai.expect;

interface TestParams {
    t1: HRTime;
    t2?: HRTime | number;
    expectedValue: any;
}

function test<V>(p: TestParams[] | TestParams, op: (t1: HRTime, t2?: HRTime | number) => any) {
    if (Array.isArray(p)) {
        for (const p1 of p) {
            test(p1, op);
        }
    } else {
        const actual = op(p.t1, p.t2);
        expect(actual).eql(p.expectedValue);
    }
}

// const assert = chai.assert;
describe('HRTime', function () {
    describe('operations', function () {
        it('compare', function () {
            test([
                { t1: [0, 0], t2: [0, 1], expectedValue: -1 },
                { t1: [1, 1], t2: [1, 1], expectedValue: 0 },
            ], (t1, t2) => HRTimeTools.compare(t1, t2 as HRTime));
        });
        it('equals', function () {
            test([
                { t1: [0, 0], t2: [0, 1], expectedValue: false },
                { t1: [1, 1], t2: [1, 1], expectedValue: true },
            ], (t1, t2) => HRTimeTools.equals(t1, t2 as HRTime));
        });
        it('add', function () {
            test([
                { t1: [0, 0], t2: [0, 1], expectedValue: [0, 1] },
                { t1: [1, 500000000], t2: [1, 500000000], expectedValue: [3, 0] },
                { t1: [1, 999999999], t2: [1, 999999999], expectedValue: [3, 999999998] },
            ], (t1, t2) => HRTimeTools.add(t1, t2 as HRTime));
        });
        it('diff', function () {
            test([
                { t1: [0, 0], t2: [0, 1], expectedValue: [0, -1] },
                { t1: [1, 0], t2: [1, 500000000], expectedValue: [0, -500000000] },
                { t1: [1, 999999999], t2: [1, 999999999], expectedValue: [0, 0] },
                { t1: [1, 1], t2: [0, 2], expectedValue: [0, 999999999] },
            ], (t1, t2) => HRTimeTools.diff(t1, t2 as HRTime));
        });
        it('multiply', function () {
            test([
                { t1: [3, 3], t2: 1, expectedValue: [3, 3] },
                { t1: [1, 0], t2: -1, expectedValue: [-1, 0] },
                { t1: [1, 0], t2: 1 / 3, expectedValue: [0, 333333333] },
            ], (t1, t2) => HRTimeTools.multiply(t1, t2 as number));
        });
    });
});
