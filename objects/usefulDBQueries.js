var {
    dbConn
} = require('../server.js');
const sql = require('mssql')

/*
Params:
- email: string, user email address
*/
exports.getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const command = `
        SELECT TOP(1) * FROM app_user WHERE email = @email;
        ` //TOP(1) limits to one row.

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

/*
Params:
- id: int, user_id
*/
exports.getUserById = async (id) => {
    return new Promise((resolve, reject) => {
        const command = `
        SELECT TOP(1) * FROM app_user WHERE id = @id;
        ` //TOP(1) limits to one row.

        dbConn.openConnection().then((pool) => {
            const ps = new sql.PreparedStatement(pool);
            ps.input('id', sql.VarChar)
        
            ps.prepare(command, err => {
                if (err) {
                    console.log(err);
                }
        
                ps.execute({
                    id: id,
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

