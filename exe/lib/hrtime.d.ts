export declare type HRTime = [number, number];
export declare class HRTimeTools {
    static readonly ZERO: HRTime;
    static copy(time: HRTime): HRTime;
    static compare(t1: HRTime, t2: HRTime): number;
    static equals(t1: HRTime, t2: HRTime): boolean;
    static add(t1: HRTime, t2: HRTime): HRTime;
    static diff(t1: HRTime, t2: HRTime): HRTime;
    static negate(t: HRTime): HRTime;
    static multiply(t: HRTime, f: number): HRTime;
    static divide(t: HRTime, d: number): HRTime;
    private static readonly NS_PER_SEC;
    private static adjust(t);
}
