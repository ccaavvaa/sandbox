// tslint:disable:only-arrow-functions
// tslint:disable-next-line:no-implicit-dependencies
import * as chai from 'chai';
import './debug-test';
// tslint:disable-next-line:no-implicit-dependencies
import 'mocha';
import { TimeCounter } from '../lib/time-counter';
import { HRTimeTools } from '../lib/hrtime';

const expect = chai.expect;

class TimeCounterTest {
    constructor(private readonly prefix: string) {

    }
    public simpleMethod(x: string): string {
        let result: string;
        for (let i = 0; i < 100000; i++) {
            result = this.prefix + 'x';
        }
        return result;
    }

    public async1(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }

    public async async2(n: number, ms: number): Promise<void> {
        for (let i = 0; i < n; i++) {
            await this.async1(ms);
        }
    }

    public async reject(ms: number): Promise<number> {
        await this.async1(ms);
        if (ms > 100) {
            throw new Error(this.prefix);
        }
        return ms;
    }
}
// const assert = chai.assert;
describe('TimeCounter', function () {

    it('simple method', function () {
        const tc = new TimeCounter();
        const methodName = TimeCounterTest.prototype.simpleMethod.name;
        tc.instrumentFunction(TimeCounterTest, methodName);

        const testObj = new TimeCounterTest('1');
        for (let i = 0; i < 100; i++) {
            testObj.simpleMethod('x');
        }
        const info = tc.instrumentations.get(TimeCounterTest.name + '#' + methodName).execInfo;
        expect(info.count).eql(100);
        tc.cancel();
        testObj.simpleMethod('x');
        expect(info.count).eql(100);
    });
    it('async method', async function () {
        this.timeout(1000);
        const tc = new TimeCounter();
        try {
            const methodName = TimeCounterTest.prototype.async1.name;
            tc.instrumentFunction(TimeCounterTest, methodName);

            const testObj = new TimeCounterTest('1');
            for (let i = 0; i < 3; i++) {
                await testObj.async1(100);
            }
            const info = tc.instrumentations.get(TimeCounterTest.name + '#' + methodName).execInfo;
            expect(info.count).eql(3);
            expect(HRTimeTools.compare(info.total, [0, 300000000]) > 0).to.be.true;
            expect(HRTimeTools.compare(info.total, [1, 0]) < 0).to.be.true;
        } finally {
            tc.cancel();
        }
    });
    it('async method', async function () {
        this.timeout(1000);
        const tc = new TimeCounter();
        try {
            for (const f of [TimeCounterTest.prototype.async1, TimeCounterTest.prototype.async2]) {
                const methodName = f.name;
                tc.instrumentFunction(TimeCounterTest, methodName);
            }

            const testObj = new TimeCounterTest('1');
            for (let i = 0; i < 3; i++) {
                await testObj.async2(2, 100);
            }
            const info = tc.instrumentations.get(TimeCounterTest.name + '#' + 'async1').execInfo;
            expect(info.count).eql(6);
            expect(HRTimeTools.compare(info.total, [0, 600000000]) > 0).to.be.true;
            expect(HRTimeTools.compare(info.total, [1, 0]) < 0).to.be.true;
        } finally {
            tc.cancel();
        }
    });
    it('async reject', async function () {
        this.timeout(1000);
        const tc = new TimeCounter();
        try {
            for (const f of [
                TimeCounterTest.prototype.async1,
                TimeCounterTest.prototype.async2,
                TimeCounterTest.prototype.reject]
            ) {
                const methodName = f.name;
                tc.instrumentFunction(TimeCounterTest, methodName);
            }

            const testObj = new TimeCounterTest('1');
            let v = await testObj.reject(10);
            let hasError: boolean;
            try {
                v = await testObj.reject(101);
                hasError = false;
            } catch (e) {
                hasError = true;
            }
            const info = tc.instrumentations.get(TimeCounterTest.name + '#' + 'reject').execInfo;
            expect(info.count).eql(2);
            expect(HRTimeTools.compare(info.total, [0, 100000000]) > 0).to.be.true;
            expect(HRTimeTools.compare(info.total, [0, 200000000]) < 0).to.be.true;
        } finally {
            tc.cancel();
        }
    });
});
