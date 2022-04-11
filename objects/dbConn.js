const {
    Connection,
    Request
} = require("tedious");
const DateTimeOffset = require("tedious/lib/data-types/datetimeoffset");
require('dotenv').config();

//https://stackoverflow.com/questions/32657516/how-to-properly-export-an-es6-class-in-node-4
//https://docs.microsoft.com/en-us/azure/azure-sql/database/connect-query-nodejs?tabs=windows

const config = {
    authentication: {
        options: {
            userName: "application",
            password: "nt7wLoALX$Ku"
        },
        type: "default"
    },
    server: "jebra-server.database.windows.net", // update me
    options: {
        database: "WSIFPDB",
        encrypt: true,
        trustServerCertificate: false
    }
};

class DbConn {

    constructor(){
        this.connection = new Connection(config);
    }

    execute(request) {
        return new Promise((resolve,reject)=>{
            const response = [];
          
            request.on("row", (columns) => {
              const field = {};
    
              columns.forEach((col) => {
                field[col.metadata.colName] = col.value;
              });
    
              response.push(field);
            });
        
            request.on('error', error => {
                reject(error)
            });
    
            request.on('done',() => {
                resolve(response)//Return response as promise
            }); 
        
            this.connection.execSql(request);
        
          });
    }

    openConnection() {
        this.connection.on("connect", err => {
            if (err) {
                console.error(err.message);
            } else {
                //getAllRows("users");
                console.log("DB Connected.")
            }
        });
    
        this.connection.connect();
    }

    closeConnection() {
        this.connection.close();
        console.log("DB Connection Closed.")
    }
}

module.exports = DbConn;

