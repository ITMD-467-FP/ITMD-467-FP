var chai = require('chai'), chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
assert = chai.assert,
expect = chai.expect;
var server = 'http://localhost:8080';

//https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
describe("API Token Authentication Test", function () {
    //Get user row to test with
    it("Should return a JSON object with status 200.", function (done) {
        chai.request(server)
            .get('/userLogin')
            .send({email: 'dtiberi@hawk.iit.edu', password: 'hunter123'})//Set body
            .end(function (err, res) {
                should.exist(res.body);
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });

    it("Should respond with the user's row in the database.", function (done) {
        chai.request(server)
            .get('/userLogin')
            .send({email: 'dtiberi@hawk.iit.edu', password: 'hunter123'})//Set body
            .end(function (err, res) {
                should.exist(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('id');
                res.body.should.have.property('fname');
                res.body.should.have.property('lname');
                res.body.should.have.property('email');
                res.body.should.have.property('password');
                res.body.should.have.property('current_secret_token');
                done();
            });
    });

    it("Should respond with a populated current_secret_token", function (done) {
        chai.request(server)
            .get('/userLogin')
            .send({email: 'dtiberi@hawk.iit.edu', password: 'hunter123'})//Set body
            .end(function (err, res) {
                should.exist(res.body);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('current_secret_token');
                res.body.current_secret_token.should.be.exist;
                chai.assert.isTrue(res.body.current_secret_token.length > 0);
                done();
            });
    });
});