"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HRTimeTools {
    static copy(time) {
        return [time[0], time[1]];
    }
    static compare(t1, t2) {
        return t1[0] === t2[0] ? t1[1] - t2[1] : t1[0] - t2[0];
    }
    static equals(t1, t2) {
        return HRTimeTools.compare(t1, t2) === 0;
    }
    static add(t1, t2) {
        let sec = t1[0] + t2[0];
        let nsec = t1[1] + t2[1];
        return HRTimeTools.adjust([sec, nsec]);
    }
    static diff(t1, t2) {
        return HRTimeTools.add(t1, HRTimeTools.negate(t2));
    }
    static negate(t) {
        return [-t[0], -t[1]];
    }
    static multiply(t, f) {
        let sec = t[0] * f;
        let nsec = t[1] * f;
        return HRTimeTools.adjust([sec, nsec]);
    }
    static divide(t, d) {
        return HRTimeTools.multiply(t, 1 / d);
    }
    static adjust(t) {
        if (t[0] * t[1] < 0) {
            const t2 = t[1] < 0 ?
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
HRTimeTools.ZERO = [0, 0];
HRTimeTools.NS_PER_SEC = 1e9;
exports.HRTimeTools = HRTimeTools;

//# sourceMappingURL=hrtime.js.map
