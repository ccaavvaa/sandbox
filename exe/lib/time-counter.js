"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hrtime_1 = require("./hrtime");
class ExecTime {
    constructor() {
        this.count = 0;
        this.min = [Number.MAX_SAFE_INTEGER, 999999999];
        this.max = hrtime_1.HRTimeTools.ZERO;
        this.mean = hrtime_1.HRTimeTools.ZERO;
        this.total = hrtime_1.HRTimeTools.ZERO;
    }
    addExecution(time) {
        this.count++;
        if (hrtime_1.HRTimeTools.compare(this.min, time) > 0) {
            this.min = hrtime_1.HRTimeTools.copy(time);
        }
        if (hrtime_1.HRTimeTools.compare(time, this.max) > 0) {
            this.max = hrtime_1.HRTimeTools.copy(time);
        }
        this.total = hrtime_1.HRTimeTools.add(this.total, time);
        this.mean = hrtime_1.HRTimeTools.divide(this.total, this.count);
    }
}
exports.ExecTime = ExecTime;
class ExecTimeDetail extends ExecTime {
    constructor() {
        super(...arguments);
        this.details = new Map();
    }
}
exports.ExecTimeDetail = ExecTimeDetail;
class TimeCounter {
    constructor() {
        this.instrumentations = new Map();
        this.details = new Map();
        this.execInfos = new Map();
        this.stack = [];
    }
    instrumentFunction(cls, functionName) {
        const func = cls.prototype[functionName];
        const name = cls.name + '#' + functionName;
        const execInfo = new ExecTime();
        const instrumentation = {
            name: func.name,
            cls,
            func,
            execInfo,
        };
        this.instrumentations.set(name, instrumentation);
        const that = this;
        const mark = (t) => {
            that.stack.pop();
            execInfo.addExecution(t);
            let x = that;
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
            let result;
            let resultIsPromise;
            that.stack.push(name);
            let x = that;
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
                    return promise.then((v) => {
                        time = process.hrtime(time);
                        mark(time);
                        return v;
                    }, (reason) => {
                        time = process.hrtime(time);
                        mark(time);
                        return Promise.reject(reason);
                    });
                }
                else {
                    time = process.hrtime(time);
                    mark(time);
                    return result;
                }
            }
            catch (e) {
                time = process.hrtime(time);
                mark(time);
                throw e;
            }
        };
    }
    cancel() {
        for (const [key, value] of this.instrumentations) {
            value.cls.prototype[value.func.name] = value.func;
        }
        this.instrumentations.clear();
    }
}
exports.TimeCounter = TimeCounter;

//# sourceMappingURL=time-counter.js.map
