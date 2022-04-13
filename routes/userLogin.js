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

function getUser() {
    
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
                        //console.log(result.recordset[0].password);
                        resolve(result.recordset[0].password);
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
    const email = req.body.email;
    const password = passwordHash.generate(req.body.password);
    
    (async () => {
        //res.status(200);
        //res.send(await getPassword(email));
    })();
}
