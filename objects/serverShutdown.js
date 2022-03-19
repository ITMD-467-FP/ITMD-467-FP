//Credit: https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits

var dbConn;

exports.setDbConn = (conn) => {
    dbConn = conn;
}

function exitHandler(options, exitCode) {
    dbConn.closeConnection();
    //if (options.cleanup) console.log('clean');
    //if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

