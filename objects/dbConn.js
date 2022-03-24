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
            userName: process.env.APPLICATION_SQL_USERNAME,
            password: process.env.APPLICATION_SQL_PASSWORD
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

const connection = new Connection(config);

//Used for testing
const getAllRows = (table) => {
    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
        `SELECT * FROM ` + table,
        (err, rowCount) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`${rowCount} row(s) returned`);
            }
        }
    );

    request.on("row", columns => {
        columns.forEach(column => {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });

    connection.execSql(request);
}

exports.openConnection = () => {
    connection.on("connect", err => {
        if (err) {
            console.error(err.message);
        } else {
            getAllRows("users");
            console.log("DB Connected.")
        }
    });

    connection.connect();
}

exports.closeConnection = () => {
    connection.close();
    console.log("DB Connection Closed.")
}