const AWS = require('aws-sdk'),
    environment = require('../environment')

AWS.config.update({
    accessKeyId: environment[`${process.env.APP_ENVIRONMENT}`].accessKeyId,
    secretAccessKey: environment[`${process.env.APP_ENVIRONMENT}`].secretAccessKey
})

const S3 = new AWS.S3();
module.exports = S3;