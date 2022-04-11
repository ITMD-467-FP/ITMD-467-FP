console.log("Running server startup script");

// Enable error handling in express.
process.on('unhandledRejection', (reason, promise) => {
    console.log(reason)
})
process.on('uncaughtException', (reason) => {
    console.log(reason)
})