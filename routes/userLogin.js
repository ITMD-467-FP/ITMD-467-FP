module.exports = function (app) { //receiving "app" instance
    app.route('/userLogin')
        .get(getAPI)
}


var {
    dbConn
} = require('../server.js');
const sql = require('mssql')
var passwordHash = require('password-hash');
const RssParser = require('../objects/rssParser.js');

/*
Description:

Method: Get

Parameters: 
- In Body:
    - email : string
    - password : string

*/

//https://www.npmjs.com/package/password-hash

var passwordHash = require('password-hash');
function generateCurrentToken(email, password){
    return passwordHash.generate(email + password);
}

async function loginAndGetUser(email, newCurrentToken) {
    return new Promise((resolve, reject) => {
        const command = `
        UPDATE app_user SET current_secret_token = @newCurrentToken WHERE email = @email;

        SELECT TOP(1) * FROM app_user WHERE email = @email;
        ` //TOP(1) limits to one row.

        dbConn.openConnection().then((pool) => {
            const ps = new sql.PreparedStatement(pool);
            ps.input('email', sql.VarChar)
            ps.input('newCurrentToken', sql.VarChar)
        
            ps.prepare(command, err => {
                if (err) {
                    console.log(err);
                }
        
                ps.execute({
                    email: email,
                    newCurrentToken: newCurrentToken
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(result.recordset[0]);
                        resolve(result.recordset[0]);
                    }
        
                    ps.unprepare(err => {
                        if (err) {
                            reject(err);
                            console.log(err);
                        }
                    });
                });
            }); 
        });
    });
}

async function getPassword(email) {
    return new Promise((resolve, reject) => {
        const command = "SELECT TOP(1) password FROM app_user WHERE email = @email;" //TOP(1) limits to one row.

        dbConn.openConnection().then((pool) => {
            const ps = new sql.PreparedStatement(pool);
            ps.input('email', sql.VarChar)
        
            ps.prepare(command, err => {
                if (err) {
                    console.log(err);
                }
        
                ps.execute({
                    email: email,
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(result.recordset);
                        try {
                            resolve(result.recordset[0].password);
                        } catch (error) {
                            console.log(error);
                            reject(error);
                        }
                    }
        
                    ps.unprepare(err => {
                        if (err) {
                            reject(err);
                            console.log(err);
                        }
                    });
                });
            }); 
        });
    });
}

function verifyPassword(input, storedHash) {
    return passwordHash.verify(input, storedHash);
}

function getAPI(req, res) {
    //const email = req.body.email;
    //const password = req.body.password;

    //Moved to url. Def a security issue that needs to be fixed later.
    const email = req.query.email;
    const password = req.query.password;

    (async () => {

        /*
        Steps:
        - Get password from db
        - Verify
        - If valid return loginAndGetUser(email)
        */
    
        getPassword(email).then((storedPassword) => {
            res.status(200);
            if(verifyPassword(password, storedPassword)){
                loginAndGetUser(email, generateCurrentToken(email, password)).then((userRow) => {
                    res.send(userRow);
                })
            }
            else {
                var failedLoginObject = {
                    error: 'Invalid username or password.'
                }
                res.send(failedLoginObject);
            }
        })
        //res.status(200);
        //res.send(await getPassword(email));
    })();
}
