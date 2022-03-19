console.log("Starting server...");

var express = require('express');;

var app = express();

app.get('/', function (req, res) { //Default api call
    res.send("Hello world!");
});

require('./routes/welcome')(app); //Link to api call and pass it our app instance.

if (!module.parent) {
    console.log("Listening...");
    module.exports = app.listen(3000);
}