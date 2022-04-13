module.exports = function (app) { //receiving "app" instance
    app.route('/userLogin')
        .post(postAPI)
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

exports.insertSource = async function insertSource(source, userId) {
    return new Promise((resolve, reject) => {
        const command = `
        DECLARE @NewSourceId TABLE (id INT)

        IF EXISTS (
            SELECT source.id FROM source
            INNER JOIN user_source
            ON user_source.user_id = @userId
        )
        BEGIN
            SELECT source.id, source.url FROM source
            INNER JOIN user_source
            ON user_source.id = @userId AND user_source.source_id = source.id
        END
        ELSE
        BEGIN
            INSERT INTO source (url) 
            OUTPUT INSERTED.id INTO @NewSourceId(id)
            VALUES(@source);

            INSERT INTO user_source(user_id, source_id)
            VALUES (@userId, (SELECT TOP(1) id FROM @NewSourceId));
        END
        `;

       
    });
}


function postAPI(req, res) {
    const userId = req.body.userId;
    const sourceUrl = req.body.sourceUrl;
    

    (async () => {

    })();
}
