module.exports = function (app) { //receiving "app" instance
    app.route('/newUser')
        .get(getAPI)
        .post(postAPI);
}

/*
Description:

Method: Post

Parameters: 
- In Body:
    - email : string
    - password : string
    - fname : string (User's first name)
    - lname : string (User's last name)

*/

var TYPES = require('tedious').TYPES;
var server = require('../server.js');
var Request = require('tedious').Request;

function getAPI(req, res) {}

function postAPI(req, res) {
    
}