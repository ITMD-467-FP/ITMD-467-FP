const sql = require('mssql')

/*
Params:
- email: string, user email address
*/
exports.getUserByEmail = async (email, dbConn) => {
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
exports.getUserById = async (id, dbConn) => {
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

/*
Params:
- userId: int, user_id
*/
exports.getAllSources = async (userId, dbConn) => {
    return new Promise((resolve, reject) => {
        const command = `
        SELECT source.id, source.url FROM source 
        INNER JOIN user_source
        ON user_source.user_id = @userId AND source.id = user_source.source_id;
        `;

        dbConn.openConnection().then((pool) => {
            const ps = new sql.PreparedStatement(pool);
            ps.input('userId', sql.VarChar)
        
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