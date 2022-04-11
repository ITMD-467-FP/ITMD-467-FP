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

function insertUser(email, password, fname, lname, res){
    /*
    const command = `
    INSERT INTO app_user (email, password, fname, lname) 
    OUTPUT INSERTED.id, INSERTED.email, INSERTED.fname, INSERTED.lname
    VALUES(@email, @password, @fname, @lname)`;
    */

    const command = `
    IF EXISTS (SELECT * FROM app_user WHERE email = @email)
    BEGIN
        SELECT 'EXISTS'
    END
    ELSE
    BEGIN
        INSERT INTO app_user (email, password, fname, lname) 
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.fname, INSERTED.lname
        VALUES(@email, @password, @fname, @lname)
    END
    `;
    
    dbConn.openConnection().then((pool) => {
        const ps = new sql.PreparedStatement(pool);

        ps.input('email', sql.VarChar)
        ps.input('password', sql.VarChar)
        ps.input('fname', sql.VarChar)
        ps.input('lname', sql.VarChar)

        ps.prepare(command, err => {
            if (err) {
                console.log(err);
            }

            ps.execute({
                email: email,
                password: password,
                fname: fname,
                lname: lname
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200);
                    res.send(result.recordset);
                }

                ps.unprepare(err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    });
}

var {
    dbConn
} = require('../server.js');
const sql = require('mssql')
var passwordHash = require('password-hash');
//https://www.npmjs.com/package/password-hash

function getAPI(req, res) {}

function postAPI(req, res) {
    const email = req.body.email;
    const password = passwordHash.generate(req.body.password);
    const fname = req.body.fname;
    const lname = req.body.lname;

    insertUser(email, password, fname, lname, res);
}

