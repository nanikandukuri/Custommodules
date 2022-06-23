const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIA4RJ3O4EKVZIGWKP3',
    secretAccessKey: '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'
})

const S3 = new AWS.S3();
module.exports = S3;