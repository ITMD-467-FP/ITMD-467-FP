module.exports = function (app) { //receiving "app" instance
    app.route('/userLogin')
        .post(postAPI)
}

var {
    dbConn
} = require('../server.js');
const sql = require('mssql')

/*
Description:

Method: Post

Parameters: 
- In Body:
    - email : string
    - password : string

*/

//https://www.npmjs.com/package/password-hash


function postAPI(req, res) {
    const userId = req.body.userId;
    const sourceUrl = req.body.sourceUrl;
    

    (async () => {

    })();
}
