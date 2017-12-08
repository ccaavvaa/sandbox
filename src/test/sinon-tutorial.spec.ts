// tslint:disable:only-arrow-functions
// tslint:disable-next-line:no-implicit-dependencies
import * as chai from 'chai';
import './debug-test';
// tslint:disable-next-line:no-implicit-dependencies
import 'mocha';
// tslint:disable-next-line:no-implicit-dependencies
import * as sn from 'sinon';
import { MyServer, Person } from '../lib/sinon-tutorial';

const expect = chai.expect;
// const assert = chai.assert;
describe('sinon stub', function () {

    it('without stub', async function () {
        const server: MyServer = new MyServer();
        let err = null;
        try {
            const person = await server.getPerson(1);
        } catch (e) {
            err = e;
        }
        expect(err).to.be.not.null;
    });

    it('with stub', async function () {
        const server: MyServer = new MyServer();
        const stub = sn.stub(server, 'getPerson');
        const expectedPersons = [1, 2]
            .map<Person>((id) => {
                return {
                    id, name: 'Nom' + id, firstName: 'firstName' + id,
                };
            });
        for (const p of expectedPersons) {
            stub.withArgs(p.id).returns(Promise.resolve<Person>(p));
            let err = null;
            try {
                const person = await server.getPerson(p.id);
                expect(person).eql(p);
            } catch (e) {
                err = e;
            }
            expect(err).to.be.null;
        }
    });
});
