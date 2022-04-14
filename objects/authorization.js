//https://medium.com/@onejohi/securing-your-express-restful-apis-using-json-web-tokens-8c2fff0f4e7f
// Implementing the concepts from this article as I do not want to take chances with security.  -Dan Tiberi 

/*
The process I have in mind for authentication
1- When a user logs in, a secret key is generated and returned to them. 
2- To make any request besides log in the request must be sent with that secret key in the authorization header.
    - The authorization header is an API key in postman with a key of the user's id and a value of the token
3- That key is verified using the concepts from the article
- Dan Tiberi
*/

let jwt = require('jsonwebtoken');
var { dbConn } = require('../server.js');

async function getUserToken(userId){
    return new Promise((resolve, reject) => {
        const command = `
            SELECT current_secret_token FROM app_user WHERE id = @userId;
        `;

        dbConn.openConnection().then((pool) => {
            const ps = new sql.PreparedStatement(pool);
            ps.input('userId', sql.Int)

            ps.prepare(command, err => {
                if (err) {
                    console.log(err);
                }
        
                ps.execute({
                    userId: userId,
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(result.recordset[0]);
                        resolve(result.recordset[0].current_secret_token);
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

function verifyToken(userToken, bearerToken){
    jwt.verify(bearerToken, userToken, (err, result) => { //Verify token matches secret key
        if (err) {
            return false;
        } else {
            return true;
        }
    })
}

module.exports.validateToken = function (req, res, next) {
    //Get user's token from their id

    var bearerHeader = req.headers["authorization"]//Retrieve authorization header from the incoming request
    if (typeof bearerHeader !== 'undefined') { //If the request does have an authorization header
        const bearer = bearerHeader.split(" "); 
        const bearerToken = bearer[1];

        getUserToken(bearer[0]).then(
            (userToken) => {
                if(userToken){//Not empty and not null. 
                    if(verifyToken(userToken, bearerToken)) { //Token is validated
                        next();
                    }
                    else{
                        res.sendStatus(403);
                    }
                }
                else{ // No token was ever generated meaning the user didn't log in. 
                    res.sendStatus(403);
                }
            }
        );
    } else { //There is no authorization header
        res.sendStatus(403); 
    }
}

/*
var bearerHeader = req.headers["authorization"]//Retrieve authorization header from the incoming request

    if (typeof bearerHeader !== 'undefined') { //If the request does have an authorization header
        const bearer = bearerHeader.split(" "); 
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'secretkey', (err, result) => { //Verify token matches secret key
            if (err) {
                res.sendStatus(403);
            } else {
                next();
            }
        })
    } else {
        res.sendStatus(403);
    }
*/