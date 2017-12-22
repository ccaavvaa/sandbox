// tslint:disable:ban-types
import { HRTime, HRTimeTools } from './hrtime';

export class ExecTime {
    public count: number = 0;
    public min: HRTime = [Number.MAX_SAFE_INTEGER, 999999999];
    public max: HRTime = HRTimeTools.ZERO;
    public mean: HRTime = HRTimeTools.ZERO;
    public total: HRTime = HRTimeTools.ZERO;
    public addExecution(time: HRTime) {
        this.count++;
        if (HRTimeTools.compare(this.min, time) > 0) {
            this.min = HRTimeTools.copy(time);
        }
        if (HRTimeTools.compare(time, this.max) > 0) {
            this.max = HRTimeTools.copy(time);
        }
        this.total = HRTimeTools.add(this.total, time);
        this.mean = HRTimeTools.divide(this.total, this.count);
    }
}

export interface FunctionInstrumentation {
    name: string;
    cls: Function;
    func: Function;
    execInfo: ExecTime;
}

export class ExecTimeDetail extends ExecTime {
    public readonly details: Map<string, ExecTimeDetail> = new Map<string, ExecTimeDetail>();
}
export class TimeCounter {
    public readonly instrumentations: Map<string, FunctionInstrumentation> = new Map<string, FunctionInstrumentation>();
    public readonly details: Map<string, ExecTimeDetail> = new Map<string, ExecTimeDetail>();
    private execInfos = new Map<string, ExecTime>();

    private readonly stack: string[] = [];
    public instrumentFunction(cls: Function, functionName: string) {
        const func = cls.prototype[functionName] as Function;
        const name = cls.name + '#' + functionName;
        const execInfo = new ExecTime();
        const instrumentation = {
            name: func.name,
            cls,
            func,
            execInfo,
        };
        this.instrumentations.set(name, instrumentation);
        // tslint:disable-next-line:no-this-assignment
        const that = this;
        const mark = (t: HRTime) => {
            that.stack.pop();
            execInfo.addExecution(t);
            let x: { details: Map<string, ExecTimeDetail> } = that;
            for (const fName of that.stack) {
                x = x.details.get(fName);
            }
            let d = x.details.get(name);
            if (!d) {
                d = new ExecTimeDetail();
                x.details.set(name, d);
            }
            d.addExecution(t);
        };
        cls.prototype[functionName] = function () {
            let time = process.hrtime();
            let result: any;
            let resultIsPromise: boolean;

            that.stack.push(name);
            let x: { details: Map<string, ExecTimeDetail> } = that;
            for (const fName of that.stack) {
                let d = x.details.get(fName);
                if (!d) {
                    d = new ExecTimeDetail();
                    x.details.set(name, d);
                }
                x = d;
            }

            try {
                result = func.apply(this, arguments);
                const promise = Promise.resolve(result);
                resultIsPromise = promise === result;
                if (resultIsPromise) {
                    return promise.then(
                        (v) => {
                            time = process.hrtime(time);
                            mark(time);
                            return v;
                        },
                        (reason) => {
                            time = process.hrtime(time);
                            mark(time);
                            return Promise.reject(reason);
                        }
                    );
                } else {
                    time = process.hrtime(time);
                    mark(time);
                    return result;
                }
            } catch (e) {
                time = process.hrtime(time);
                mark(time);
                throw e;
            }
        };
    }

    public cancel(): void {
        for (const [key, value] of this.instrumentations) {
            value.cls.prototype[value.func.name] = value.func;
        }
        this.instrumentations.clear();
    }
}
