var chai = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = require("assert");
const TrendAlgorithm = require('../objects/trendAlgorithm');

//https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
describe("Trend Algorithm Tests", function () {
    const alg = new TrendAlgorithm();
    alg.insert("Hi Dan how are you doing today?", "null", false);
    it("Should contain a hash table with 7 keys given input: 'Hi Dan how are you doing today?'", function (done) {
        assert.equal(alg.hashtable.keys().length, 7);
        done();
    });
});