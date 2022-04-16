var chai = require('chai'),
    chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
assert = chai.assert,
    expect = chai.expect;
const ApiCalls = require("../util/apiCalls.js");

var server = 'http://localhost:8080';

/**
 * email: "TestEmail@gmail.com",
                    password: "WaterIsDry",
                    fname: "Mr",
                    lname: "Testingson"

                    sourceUrl: "http://feeds.bbci.co.uk/news/world/rss.xml",
                     sourceUrl: "http://feeds.reuters.com/Reuters/worldNews"
 */

//Init db variables before test
const doBefore = async () => {
    return new Promise((resolve, reject) => {
        const email = "TestEmail@gmail.com";
        const password = "WaterIsDry"
        //Create new user
        ApiCalls.newUser(email, password, "Mr", "Testingson")
            .then((res) => ApiCalls.loginUser(email, password)
                .then((loginReturn) => {
                    //console.log("LOGIN RETURN:");
                    //console.log(loginReturn);
                    this.userData = loginReturn;
                    //console.log("userData set");
                })).then(
                async (res) => {
                    //console.log("Trying to add source 1");
                    await ApiCalls.addSource(this.userData.id, "http://feeds.bbci.co.uk/news/world/rss.xml", this.userData.current_secret_token)
                    await ApiCalls.addSource(this.userData.id, "https://abcnews.go.com/abcnews/moneyheadlines", this.userData.current_secret_token)
                    resolve();
                }
            );
    });
}

//http://feeds.bbci.co.uk/news/world/rss.xml
const doAfter = async (userData) => {
    return new Promise((resolve, reject) => {
        //console.log("CALLING AFTER");
        //console.log(userData);
        const DbConn = require('../objects/dbConn');
        const sql = require('mssql');
        var dbConn = new DbConn();

        const command = `
            DELETE FROM app_user WHERE id = @userId;
            `;

        dbConn.openConnection().then((pool) => {
            const ps = new sql.PreparedStatement(pool);
            ps.input('userId', sql.Int)
        
            ps.prepare(command, err => {
                if (err) {
                    console.log(err);
                }
        
                ps.execute({
                    userId: userData.id,
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(result.recordset[0]);
                        resolve(dbConn);
                    }
        
                    ps.unprepare(err => {
                        if (err) {
                            reject(err);
                            console.log(err);
                        }
                    });
                });
            }); 
        });
    });
}

//https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
describe("getAllSources Tests", function () {
    const email = "TestEmail@gmail.com";
    const password = "WaterIsDry";  

    beforeEach(async function () {
        //console.log("CALLING BEFORE");
        await doBefore();
    });

    it("Should return status 200 with a source id and url.", async () => {

        const userData = await ApiCalls.loginUser(email, password);

        //console.log("DO TEST");
        //console.log(userData);

        after(async function () {
            //console.log("CALLING AFTER");
            const dbConn = await doAfter(userData);
            dbConn.closeConnection();
        });

        const res = await chai.request(server)
            .get('/getAllSources')
            .set(String(userData.id), String(userData.current_secret_token))
            .send({
                userId: String(userData.id)
            });
        expect(res.status).to.equal(200);
        expect(res.body[0].id).to.be.a('number');
        expect(res.body[0].url).to.be.a('string');
    });

    it("Should return two sources.", async () => {

        const userData = await ApiCalls.loginUser(email, password);

        //console.log("DO TEST");
        //console.log(userData);

        after(async function () {
            //console.log("CALLING AFTER");
            const dbConn = await doAfter(userData);
            dbConn.closeConnection();
        });

        const res = await chai.request(server)
            .get('/getAllSources')
            .set(String(userData.id), String(userData.current_secret_token))
            .send({
                userId: String(userData.id)
            });
        expect(res.status).to.equal(200);
        expect(res.body[0].url).to.not.equal("");
        expect(res.body[1].url).to.not.equal("");
        expect(res.body[0].url).to.not.be.undefined;
        expect(res.body[1].url).to.not.be.undefined;
    });

    it("Should return status 403 when an invalid token is used.", async () => {
    
        const userData = await ApiCalls.loginUser(email, password);

        after(async function () {
            const dbConn = await doAfter(userData);
            dbConn.closeConnection();
        });

        const res = await chai.request(server)
            .get('/getAllSources')
            .set(String(userData.id), String(userData.current_secret_token) + "BLAH")
            .send({
                userId: String(userData.id)
            });
        expect(res.status).to.equal(403);
    });

});


