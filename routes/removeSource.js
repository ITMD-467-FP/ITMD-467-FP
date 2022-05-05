var authorization = require("../objects/authorization");

module.exports = function (app) { //receiving "app" instance
    app.route('/removeSource')
        .delete(deleteAPI);

}

var {
    dbConn
} = require('../server.js');
const sql = require('mssql')

/*
Description:

Method: Delete

Parameters: 
- In Body:
    sourceId
    userId

*/

//https://www.npmjs.com/package/password-hash

async function removeSource(sourceId, userId) {
   
}

//Runs after the token authorization was successful.
function authComplete(req, res) {

    const sourceId = req.body.sourceId;
    const userId = req.body.userId;

    (async () => {
        removeSource(sourceId, userId).then((data) => {
            res.status(200);
            res.send(data);
        })
    })();
}

function deleteAPI(req, res) {
    authorization.validateToken(req, res, authComplete);
}