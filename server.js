'use strict';
require('dotenv').config();
var express = require('express');

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
//End

app.get('/', function (req, res) { //Default api call
    res.send("Hello world!");
});

require('./routes/welcome')(app); //Link to api call and pass it our app instance.

if (!module.parent) {
    console.log("Listening...");
    module.exports = app.listen(3000);
}