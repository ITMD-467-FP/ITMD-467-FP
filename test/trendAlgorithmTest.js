var chai = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = require("assert");
const TrendAlgorithm = require('../objects/trendAlgorithm');

//https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
describe("Trend Algorithm Insert Tests. Input: 'Hi Dan how are you doing today?", function () {
    var alg = new TrendAlgorithm();
    alg.insert("Hi Dan how are you doing today?", "The News", false);

    it("Should contain a hash table with 7 keys.", function (done) {
        assert.equal(alg.hashtable.keys().length, 7);
        done();
    });

    it("Should contain a single source for each term.", function (done) {
        assert.equal(alg.hashtable.get("Dan")[1].length, 1);
        done();
    });

    it("Should contain multiple sources when input repeated with a different source.", function (done) {
        alg.insert("Hi Dan how are you doing today?", "The Other News", false);

        assert.equal(alg.hashtable.get("Dan")[1].length, 2);

        // Cleanup. Undo insert.
        alg = new TrendAlgorithm();
        alg.insert("Hi Dan how are you doing today?", "The News", false);

        done();
    });

});