var chai = require('chai'), chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
assert = chai.assert,
expect = chai.expect;
var server = 'http://localhost:3000';

//https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
describe("/welcome API Call", function () {
    it("Should return a JSON object with status 200.", function (done) {
        chai.request(server)
            .get('/welcome?name=Daniel')
            .end(function (err, res) {
                should.exist(res.body);
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });

    it("Contains the name and welcome message.", function (done) {
        chai.request(server)
            .get('/welcome?name=Daniel')
            .end(function (err, res) {
                res.body.should.have.property('name');
                res.body.should.have.property('message');
                expect(res.body.name).to.be.a('string');
                expect(res.body.message).to.be.a('string');
                res.body.name.should.equal('Daniel');
                res.body.message.should.equal('Welcome to the cool kids club, Daniel');
                done();
            });
    });
});

