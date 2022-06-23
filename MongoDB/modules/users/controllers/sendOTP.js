const logger = require('../../../logger');
const utils = require('../../../utils/utils');

let express = require('express'),
    router = express(),
    sendEmail = require('../../../utils/sendEmail'),
    otp_Auth = require('../models/otpAuthorization'),
    user = require('../../users/models/userProfile'),
    sendSMS = require('../../../utils/send_SMS'),
    CONSTANTS = require('../../../utils/Constants');

// Here In this function we are sending OTP to phoneNumber given in request and saving the OTP send data in to DB
const sendOTP = ((req, res) => {
    var input = req.body;
    var response = { code: 1, msg: "" };
    checkValidations(response, input);
    if (response.code === 1) {
        if (input.type == "email" || input.type == "phoneNumber") {
            var verification = new otp_Auth({})
            let OTP = Math.floor(1000 + Math.random() * 9000);
            let query = {}
            var email;
            var phoneNumber;
            if (input.type === "email") {
                email = input.value
                query = { email: { $in: input.value } }
            } else if (input.type === "phoneNumber") {
                phoneNumber = input.value
                query = { phoneNumber: { $in: input.value } }
            }
            user.findOne(query).exec((err, userData) => {
                if (err) {
                    res.status(401).json(utils.getErrorResponse({}, CONSTANTS.STATUS_MESSAGE_FAILURE, CONSTANTS.STATUS_CODE_ERROR))
                } else if (!userData) {
                    res.status(404).json(utils.getErrorResponse({}, `No user found with selected ${input.type} of ${email || phoneNumber}, Please register to send OTP`, CONSTANTS.STATUS_CODE_ERROR))
                } else {
                    verification.OTP = parseInt(OTP)
                    verification.phoneNumber = phoneNumber
                    verification.email = email
                    verification.verificationStatus = false
                    verification.passwordResetToken = false
                    verification.createdDateTime = new Date()
                    verification.expiryDateTime = new Date(new Date().getTime() + 1000000)
                    verification.updatedDateTime = new Date()
                    verification.save((err, verificationData) => {
                        if (err) {
                            logger.err("Error in saving OTP verfication data for sendOTP", err)
                            res.status(401).json({ code: 0, msg: "Error in saving OTP verfication data for sendOTP" })
                        } else {
                            if (email) {
                                sendEmailToUser(res, verificationData, email, userData);
                            } else if (phoneNumber) {
                                sendotp_Mobile(verificationData, phoneNumber, userData)
                            }
                            if (typeof req.body.user != 'undefined') {
                                var obj = req.body.user.toObject();
                                delete obj.password;
                                delete obj.createdDateTime;
                                delete obj.updateDateTime;
                                delete obj.tokens;
                                delete obj.appId;
                                delete obj.deviceId;
                                delete obj.deviceType;
                                delete obj.referralIds;
                                delete obj.appVersion;
                                res.status(200).json({ code: 1, msg: "Success", data: obj })
                                return false
                            } else {
                                res.status(200).json({ code: 1, msg: `Your OTP will be sent to your registered ${input.type} of ${email || phoneNumber}.` })
                            }
                        }
                    })
                }
            })
        } else {
            res.status(401).json({ code: 0, msg: 'email/PhoneNumber is Mandatory' })
        }
    } else {
        res.status(401).json(response)
    }
})

function sendEmailToUser(res, verificationData, email, userData) {
    sendEmail(email, 'OTP - ModuleDevelopment', email, `Dear ${userData.firstName} ${userData.lastName}, \n\n${verificationData.OTP} is your OTP to access BBFitness App. This OTP will be valid for 3 minutes. \nStay fit. Stay healthy.`);
}

function sendotp_Mobile(verificationData, phoneNumber, userData) {
    sendSMS(userData.countryPrefixCode + userData.phoneNumber, verificationData)
}

// In these function input request will be  validated
function checkValidations(response, input) {

    if (!(input.type)) {
        response.code = 0;
        response.msg = 'type cannot be empty'
    } else if (utils.isStringBlank(input.type)) {
        response.code = 0;
        response.msg = 'type cannot be empty'
    } else if (utils.isStringBlank(input.value)) {
        response.code = 0;
        response.msg = 'value cannot be empty'
    } else if (input.type == "phoneNumber" && !utils.isValidPhoneNumber(input.value)) {
        response.code = 0;
        response.msg = 'Invalid phoneNumber'
    } else if (input.type == "email" && !utils.isValidEmail(input.value)) {
        response.code = 0;
        response.msg = 'Invalid email address'
    } else {
        return response;
    }

}


module.exports = { sendOTP }



