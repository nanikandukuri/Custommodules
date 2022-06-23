var winston = require('winston');


dateFormat = () => { return new Date(Date.now()).toUTCString() }


// define the custom settings for each transport (file, console)
var options = {
    info: {
        level: 'info',
        filename: "log4js_logs/info/fantasy-infoLogger.log",
        handleExceptions: false,
        json: true,
        maxsize: 1024 * 1024 * 5, // 5MB
        maxFiles: 05,
        colorize: false,
    },
    error: {
        level: 'error',
        filename: "log4js_logs/error/fantasy-errorLogger.log",
        handleExceptions: true,
        json: true,
        maxsize: 1024 * 1024 * 5, // 5MB
        maxFiles: 05,
        colorize: true,
    },
    warn: {
        level: 'warn',
        filename: "log4js_logs/warning/fantasy-warningLogger.log",
        handleExceptions: false,
        json: true,
        maxsize: 1024 * 1024 * 5, // 5MB
        maxFiles: 05,
        colorize: true,
    },
    debug: {
        level: 'debug',
        filename: "log4js_logs/debug/fantasy-debugLogger.log",
        handleExceptions: false,
        json: true,
        maxsize: 1024 * 1024 * 5, // 5MB
        maxFiles: 05,
        colorize: true,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.info),
        new winston.transports.File(options.error),
        new winston.transports.File(options.warn),
        new winston.transports.File(options.debug),
        new winston.transports.Console(options.console)
    ],
    format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${info.message} | `
        message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
        message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
        return message
    }),
    exitOnError: false, // do not exit on handled exceptions
});


logger.addListener('data', (data) => {

})


module.exports = logger;