module.exports = function (app) { //receiving "app" instance
    app.route('/getAllSources')
        .get(getAPI);
}

var {
    dbConn
} = require('../server.js');
var authorization = require("../objects/authorization");
const UsefulDBQueries = require("../util/usefulDBQueries");

/*
Description: Get all of a user's sources from the database given the user id.

Method: get

Parameters: 
- In Body:
    - userId: id of the user to query against.
*/

//Runs after the token authorization was successful.
function authComplete(req, res){
    const userId = req.body.userId;

    (async () => {
        UsefulDBQueries.getAllSources(userId, dbConn).then(
            (queryRes) => {
                res.status(200);
                res.send(queryRes);
            }
        );
    })();
}

function getAPI(req, res){
    authorization.validateToken(req, res, authComplete, false);
}

function postAPI(req, res){} //This needs to be here. Don't ask me.