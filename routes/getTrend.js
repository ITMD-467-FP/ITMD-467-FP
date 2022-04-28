module.exports = function (app) { //receiving "app" instance
    app.route('/getTrend')
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
- In url:
    - userId: id of the user to query against.
    - term: term to search for.
*/

//Runs after the token authorization was successful.
async function authComplete(req, res) {
    //const userId = req.body.userId;

    //Moved to url. Def a security issue that needs to be fixed later.
    const userId = req.query.userId;
    const term = req.query.term;

    let trends = new TrendAlgorithm();
    let parser = new RssParser();

    if (!typeof term === 'string') {
        res.status(500);
        res.send("Invalid term. Term was not a string");
    }
    
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

    //Check if param is in trends
    let data = trends.hashtable.get(term);
    //console.log(data);
    if(data != -1){
        res.status(200);
        res.send(data);
    }
    else{
        var failedGetTrendObject = {
            error: `The term ${term} was not found in the list of trends.`
        }
        res.status(200);
        res.send(failedGetTrendObject);
    }
    
}

function getAPI(req, res) {
    authorization.validateToken(req, res, authComplete, false);
}
