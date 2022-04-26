'use strict';
const startupScript = require("./objects/serverStartup");
require('dotenv').config();
var express = require('express');
const TrendAlgorithm = require('./objects/trendAlgorithm');
const RssParser = require('./objects/rssParser');
const fs = require('fs');

console.log("Starting server...");
//console.log(process.env.APPLICATION_SQL_USERNAME);

var app = express();

//DB Connection
var serverShutdown = require('./objects/serverShutdown')
const DbConn = require('./objects/dbConn');

var dbConn = new DbConn();
serverShutdown.setDbConn(dbConn);
//End of DB Connection

/*
const source1 = "http://feeds.bbci.co.uk/news/world/rss.xml";
const source2 = "https://moxie.foxnews.com/feedburner/world.xml";

var trends = new TrendAlgorithm();
var parser = new RssParser();
const sources = [source1, source2, "http://rss.cnn.com/rss/cnn_world.rss", "https://www.cbsnews.com/latest/rss/world", "https://thehill.com/news/feed/"];
sources.forEach(url => {
    (async () => {
        try {
            await parser.getDataString(url).then((data) => {
                trends.insert(data, url, true);
                trends.printHashtable(trends.hashtable);
                console.log(url + " DONE");
            });
        } catch (error) {
            console.log(error);
        }
    })();
});
*/

//Automatically require all routes.
fs.readdir("./routes", (err, files) => {
    files.forEach(file => {
        //app.use("/", require("./routes/" + file))
        require("./routes/" + file)(app);
    });
})

//Replaces body parser
app.use(express.json());

//Enable cors
try {
    var cors = require('cors');
    app.use(cors());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
} catch (error) {
    console.log(error);
}

if (!module.parent) {
    module.exports = app.listen(8080); //1337
    module.exports.dbConn = dbConn;
    console.log("Listening...");
}