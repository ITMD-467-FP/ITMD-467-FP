var authorization = require("../objects/authorization");

module.exports = function (app) { //receiving "app" instance
    app.route('/addSource')
        .post(postAPI);
}

var {
    dbConn
} = require('../server.js');
const sql = require('mssql')

/*
Description:

Method: Post

Parameters: 
- In Body:
    - email : string
    - password : string

*/

//https://www.npmjs.com/package/password-hash

async function insertSource(source, userId) {
    return new Promise((resolve, reject) => {
        const command = `
        DECLARE @NewSourceId TABLE (id INT)

        IF EXISTS (
            SELECT source.id FROM source
            INNER JOIN user_source
            ON user_source.user_id = @userId
            WHERE url = @source
        )
        BEGIN
            SELECT source.id, source.url FROM source
            INNER JOIN user_source
            ON user_source.user_id = @userId AND user_source.source_id = source.id
            WHERE url = @source
        END
        ELSE
        BEGIN
            INSERT INTO source (url) 
            OUTPUT INSERTED.id INTO @NewSourceId(id)
            VALUES(@source);

            INSERT INTO user_source(user_id, source_id)
            VALUES (@userId, (SELECT TOP(1) id FROM @NewSourceId));

            SELECT source.id, source.url FROM source
            INNER JOIN user_source
            ON user_source.user_id = @userId
            WHERE url = @source;
        END
        `;

        dbConn.openConnection().then((pool) => {
            const ps = new sql.PreparedStatement(pool);
            ps.input('userId', sql.Int)
            ps.input('source', sql.VarChar)

            ps.prepare(command, err => {
                if (err) {
                    console.log(err);
                }
        
                ps.execute({
                    userId: userId,
                    source: source
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

//Runs after the token authorization was successful.
function authComplete(req, res){
    
    const userId = req.body.userId;
    const sourceUrl = req.body.sourceUrl;

    (async () => {
        insertSource(sourceUrl, userId).then((data) => {
            res.status(200);
            res.send(data);
        })
    })();
}

function postAPI(req, res) {
    authorization.validateToken(req, res, authComplete)
}
