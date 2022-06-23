var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var environment = require('../environment')
require('dotenv').config()
var envType = process.env.APP_ENVIRONMENT
console.log(process.env.PORT)

mongoose.connect(environment[envType].databaseurl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
var db = mongoose.connection

var server;
db.on('error', console.error.bind(console, 'Database Connection Error:'))
db.once('open', function () {
    console.log('Connected to the database successfully.')
    var app = require('../app')
    var http = require('http')
    /**
     * Get port from environment and store in Express.
     */
    var port = normalizePort(process.env.PORT) || 8080;
    app.set('port', port)
    /**
  * Create HTTP server.
  */
    server = http.createServer(app)
    var ipaddress = "0.0.0.0"
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port, ipaddress, function () {
        console.log("Listening on " + ipaddress + ", Port " + port)
    })
    server.timeout = 1000 * 60 * 2; // 2 minutes
    server.on('error', onError)
    server.on('listening', onListening)
    console.log(`Worker ${process.pid} started`)
})

exports = module.exports = {
    mongoose: mongoose
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10)
    if (isNaN(port)) {
        // named pipe
        return val
    }
    if (port >= 0) {
        // port number
        return port
    }
    return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.log(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.log(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    console.log('Listening on ' + bind)
}