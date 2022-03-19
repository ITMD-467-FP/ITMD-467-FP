console.log("Starting server...");

var express = require('express');;

var app = express();
bodyParser = require("body-parser"),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");


app.get('/', function (req, res) { //Default api call
    res.send("Hello world!");
});

require('./routes/welcome')(app); //Link to api call and pass it our app instance.

if (!module.parent) {
    console.log("Listening...");
    module.exports = app.listen(3000);
}