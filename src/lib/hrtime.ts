export type HRTime = [number, number];

export class HRTimeTools {
    public static readonly ZERO: HRTime = [0, 0];

    public static copy(time: HRTime): HRTime {
        return [time[0], time[1]];
    }
    public static compare(t1: HRTime, t2: HRTime): number {
        return t1[0] === t2[0] ? t1[1] - t2[1] : t1[0] - t2[0];
    }

    public static equals(t1: HRTime, t2: HRTime): boolean {
        return HRTimeTools.compare(t1, t2) === 0;
    }

    public static add(t1: HRTime, t2: HRTime): HRTime {
        let sec = t1[0] + t2[0];
        let nsec = t1[1] + t2[1];

        return HRTimeTools.adjust([sec, nsec]);
    }

    public static diff(t1: HRTime, t2: HRTime): HRTime {
        return HRTimeTools.add(t1, HRTimeTools.negate(t2));
    }
    public static negate(t: HRTime): HRTime {
        return [-t[0], -t[1]];
    }

    public static multiply(t: HRTime, f: number): HRTime {
        let sec = t[0] * f;
        let nsec = t[1] * f;
        return HRTimeTools.adjust([sec, nsec]);
    }

    public static divide(t: HRTime, d: number): HRTime {
        return HRTimeTools.multiply(t, 1 / d);
    }
    private static readonly NS_PER_SEC = 1e9;

    private static adjust(t: HRTime): HRTime {
        if (t[0] * t[1] < 0) {
            const t2: HRTime = t[1] < 0 ?
                [t[0] - 1, HRTimeTools.NS_PER_SEC + t[1]] :
                [t[0] + 1, -HRTimeTools.NS_PER_SEC + t[1]];
            return HRTimeTools.adjust(t2);
        }

        let f = t[0] >= 0 ? Math.floor : Math.ceil;
        let sec = f(t[0]);
        let nsec = (t[0] - sec) * HRTimeTools.NS_PER_SEC + t[1];
        f = nsec >= 0 ? Math.floor : Math.ceil;
        let sec2 = f(nsec / HRTimeTools.NS_PER_SEC);
        return [sec + sec2, f(nsec - sec2 * HRTimeTools.NS_PER_SEC)];
    }
}
