const sql = require('mssql')

//https://stackoverflow.com/questions/32657516/how-to-properly-export-an-es6-class-in-node-4
//https://docs.microsoft.com/en-us/azure/azure-sql/database/connect-query-nodejs?tabs=windows
/*
const config = {
    user: "application",
    password: "nt7wLoALX$Ku",
    database: "WSIFPDB",
    server: "jebra-server.database.windows.net",
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
        database: "WSIFPDB"
    },
    authentication: {
        type: "azure-active-directory-password",                         
        options: {
            userName: "application",                    
            password: "nt7wLoALX$Ku",      
            clientId: "b7fc6ca2-b36d-4ec6-93d3-8f619213b913"          
            }
    },
};
*/
const config = {
    user: "application",
    password: "nt7wLoALX$Ku",
    database: "WSIFPDB",
    server: "jebra-server.database.windows.net",
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: false // change to true for local dev / self-signed certs
    }
  }

class DbConn {

    constructor() {
        //this.connection = new Connection(config);
        this.pool = new sql.ConnectionPool(config);
    }

    //Returns this class when connected;
    openConnection() {
        return new Promise((resolve, reject) => {
            this.pool.connect()
                .then(pool => {
                    console.log('Database Connected');
                    resolve(pool);
                })
        });
    }

    async openConnectionAsync() {
        await this.pool.connect()
            .then(pool => {
                console.log('Database Connected');
                return pool;
            })
    }

    closeConnection() {
        //this.connection.close();
        this.pool.close();
        console.log("DB Connection Pool Closed.")
    }

    execute(request, connection) {
        return new Promise((resolve, reject) => {
            const response = [];

            request.on("row", (columns) => {
                const field = {};

                columns.forEach((col) => {
                    field[col.metadata.colName] = col.value;
                });

                response.push(field);
            });

            request.on('error', error => {
                console.log(error);
                reject(error);
                return;
            });

            request.on('done', () => {
                resolve(response); //Return response as promise
            });

            request.on('doneProc', () => {
                resolve(response); //Return response as promise
            });

            //console.log("EXECUTING");
            connection.execSql(request);
            //console.log("DONE EXECUTING");
        });
        
    }
}

module.exports = DbConn;