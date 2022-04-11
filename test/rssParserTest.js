var chai = require('chai')
const assert = require("assert");
const RssParser = require('../objects/rssParser');

//https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
describe("RSS Parser Test", function () {
    var parser = new RssParser();

    const url = "https://www.feedforall.com/sample.xml"//Sample rss feed

    it("Should return a string with 43 words from the sample RSS feed.", function (done) {
        (async () => {
            try {
                await parser.getDataString(url).then((data) => {
                    //console.log(data.split(" ").length);
                    chai.assert.equal(data.split(" ").length, 43);
                });
            } catch (error) {
                console.log(error);
            }
        })();

        done();
    });

});