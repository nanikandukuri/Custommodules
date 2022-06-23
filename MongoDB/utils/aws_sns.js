var AWS = require('aws-sdk');
var environment = require('../environment')
require('dotenv').config()
AWS.config.access_Key_id = 'AKIA4RJ3O4EKVZIGWKP3'
AWS.config.Access_Key = 'xCSBZy2t9BroIWTVDUAcg23PRYH1kjbuirQ5MteL'



// AWS.config.access_Key_id = environment[`${process.env.APP_ENVIRONMENT}`].accessKeyId
// AWS.config.Access_Key = environment[`${process.env.APP_ENVIRONMENT}`].secretAccessKey
AWS.config.region = 'ap-south-1'


var sns = new AWS.SNS({
    apiVersion: '2021-09-02', // yyyy-mm-dd
    correctClockSkew: true
});


var setParams = {
    attributes: { /* required */
        // 'DefaultSMSType': 'Promotional',
        'DefaultSenderID': 'BBFitness',
        'DefaultSMSType': 'Transactional',
        // 'MonthlySpendLimit': "34"
    }
};
sns.setSMSAttributes(setParams, function (err, data) {
    if (err) {
        console.log(err, err.stack); // an error occurred
    } else {
        console.log(data); // successful response
    }
});

module.exports = {
    AWS,
    sns
};