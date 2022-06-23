var AWSMessage = require('./AWSMessage');

var sendSMS = (phoneNumber, verificationData, type) => {

    let message = "";
    message = `${verificationData.OTP} is your OTP from the Module Development Team. This OTP will be active for 3 minutes.`
    AWSMessage.sendMessage(phoneNumber, message)
}
module.exports = sendSMS;