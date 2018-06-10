const if_dev = process.env.NODE_ENV == "development" ? true:false;
if (if_dev) {
    require("dotenv").load();
}

const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();

describe("Check DB", () => {
    const MongoClient = require('mongodb').MongoClient;
    const urlDB = process.env.DB;
    it("Expect to connect to DB", (done) => {
        MongoClient.connect(urlDB, { useNewUrlParser: true }).should.not.be.rejected.notify(done);
    });

    describe("connect_db", () => {
        const connectDB = require('../utils/connect_db');
        it("expect load a connect_db function and not throw", (done)=> {
            expect(connectDB).to.be.a("function");
            expect(connectDB).to.not.throw();
            done();
        });
        it("should be fullfiled and should be an object", (done)=>{
            connectDB().should.be.fulfilled.and.be.an('object').notify(done);
        });


    })
})
