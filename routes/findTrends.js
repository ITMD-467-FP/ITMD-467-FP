module.exports = function (app) { //receiving "app" instance
    app.route('/findTrends')
        .get(getAPI);
}

var {
    dbConn
} = require('../server.js');

var authorization = require("../objects/authorization");
const TrendAlgorithm = require('../objects/trendAlgorithm');
const RssParser = require('../objects/rssParser');
const UsefulDBQueries = require('../util/usefulDBQueries');

/*
Description: Get all of a user's sources, calculate the trends, return the hashtable as a json array.

Method: get

Parameters: 
- In Body:
    - userId: id of the user to query against.
*/

//Runs after the token authorization was successful.
async function authComplete(req, res) {
    const userId = req.body.userId;

    let trends = new TrendAlgorithm();
    let parser = new RssParser();
    
    let sources = [];

    //Call getAllSources
    sources = await UsefulDBQueries.getAllSources(userId, dbConn);
    
    //console.log(sources);

    for (var i = 0; i < sources.length; i++) {
        let url = sources[i].url;
        //console.log(url);

        try {
            const data = await parser.getDataString(url);
            trends.insert(data, url, true);
        } catch (error) {
            console.log(error);
        }
    }
    
    res.status(200);
    res.send(trends.toJSON(trends.hashtable));
}

function getAPI(req, res) {
    authorization.validateToken(req, res, authComplete, false);
}
