'use strict';
require('dotenv').config();
var express = require('express');

const TrendAlgorithm = require('./objects/trendAlgorithm');
const RssParser = require('./objects/rssParser');

console.log("Starting server...");
//console.log(process.env.APPLICATION_SQL_USERNAME);

var app = express();

//DB Connection
const DbConn = require('./objects/dbConn');
var serverShutdown = require('./objects/serverShutdown')
const dbConn = require('./objects/dbConn');

exports.dbConn = dbConn;

serverShutdown.setDbConn(dbConn);
dbConn.openConnection();
//End of DB Connection

const testCallBack = (data) => {
    var trends = new TrendAlgorithm(data);
    trends.printHashtable(trends.hashtable);
}

var parser = new RssParser();
parser.getDataString("http://feeds.bbci.co.uk/news/world/rss.xml", testCallBack);

app.get('/', function (req, res) { //Default api call
    res.send("Hello world!");
});

require('./routes/welcome')(app); //Link to api call and pass it our app instance.

if (!module.parent) {
    console.log("Listening...");
    module.exports = app.listen(3000);
}