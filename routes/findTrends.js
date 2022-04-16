module.exports = function (app) { //receiving "app" instance
    app.route('/findTrends')
        .get(getAPI);
}

var authorization = require("../objects/authorization");
const TrendAlgorithm = require('../objects/trendAlgorithm');
const RssParser = require('../objects/rssParser');

/*
Description: Get all of a user's sources, calculate the trends, return the hashtable as a json array.

Method: get

Parameters: 
- In Body:
    - userId: id of the user to query against.
*/

//Runs after the token authorization was successful.
async function authComplete(req, res) {
    
}

function getAPI(req, res) {
    authorization.validateToken(req, res, authComplete, true);
}
