"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MyServer {
    async getPerson(id) {
        throw new Error('not implemented');
    }
    async getName(id) {
        return (await this.getPerson(id)).name;
    }
}
exports.MyServer = MyServer;

//# sourceMappingURL=sinon-tutorial.js.map
