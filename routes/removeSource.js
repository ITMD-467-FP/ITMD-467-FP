var authorization = require("../objects/authorization");

module.exports = function (app) { //receiving "app" instance
    app.route('/removeSource')
        .delete(deleteAPI);

}

var {
    dbConn
} = require('../server.js');
const sql = require('mssql')

/*
Description:

Method: Delete

Parameters: 
- In Body:
    sourceId
    userId

*/

//https://www.npmjs.com/package/password-hash

async function removeSource(sourceId, userId) {
    return new Promise((resolve, reject) => {
        const command = `
        DELETE FROM user_source WHERE user_id = @userId and source_id = @sourceId;
        `;

        dbConn.openConnection().then((pool) => {
            const ps = new sql.PreparedStatement(pool);
            ps.input('userId', sql.Int)
            ps.input('sourceId', sql.Int)

            ps.prepare(command, err => {
                if (err) {
                    console.log(err);
                }
        
                ps.execute({
                    userId: userId,
                    sourceId: sourceId
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(result);
                        resolve(result);
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

//Runs after the token authorization was successful.
function authComplete(req, res) {

    const sourceId = req.body.sourceId;
    const userId = req.body.userId;

    (async () => {
        removeSource(sourceId, userId).then((data) => {
            res.status(200);
            res.send(data);
        })
    })();
}

function deleteAPI(req, res) {
    authorization.validateToken(req, res, authComplete);
}