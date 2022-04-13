module.exports = function (app) { //receiving "app" instance
    app.route('/userLogin')
        .get(getAPI)
        .post(postAPI);
}


var {
    dbConn
} = require('../server.js');
const sql = require('mssql')
var passwordHash = require('password-hash');

/*
Description:

Method: Get

Parameters: 
- In Body:
    - email : string
    - password : string

*/

//https://www.npmjs.com/package/password-hash


function getAPI(req, res) {
    const email = req.body.email;
    const password = passwordHash.generate(req.body.password);


}
