import { HRTime } from './hrtime';
export declare class ExecTime {
    count: number;
    min: HRTime;
    max: HRTime;
    mean: HRTime;
    total: HRTime;
    addExecution(time: HRTime): void;
}
export interface FunctionInstrumentation {
    name: string;
    cls: Function;
    func: Function;
    execInfo: ExecTime;
}
export declare class ExecTimeDetail extends ExecTime {
    readonly details: Map<string, ExecTimeDetail>;
}
export declare class TimeCounter {
    readonly instrumentations: Map<string, FunctionInstrumentation>;
    readonly details: Map<string, ExecTimeDetail>;
    private execInfos;
    private readonly stack;
    instrumentFunction(cls: Function, functionName: string): void;
    cancel(): void;
}
