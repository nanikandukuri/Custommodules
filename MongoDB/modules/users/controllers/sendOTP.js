/**
 * @author Nani Kandukuri
 *
 */
let sendEmail = require('../../../utils/sendEmail'),
    otp_Auth = require('../models/otpAuthorization'),
    user = require('../../users/models/userProfile'),
    sendSMS = require('../../../utils/send_SMS'),
    CONSTANTS = require('../../../utils/Constants'),
    utils = require('../../../utils/utils'),
    logger = require('../../../logger');
/**
* @description The function used to  send OTP to  given phoneNumber or email and saving the
 OTP data in Database and if no user found with the input phonenumber or email we creating new user with his phone number or email.
* @param {object} req 
* @param {object} res 
* @returns {object}
*/

const sendOTP = (async (req, res) => {
    let input = req.body;
    logger.info("Send OTP" + " ::: " + input.value);
    let response = { code: 1, msg: "" };
    sendOTPValidationHandler(response, input);
    if (response.code === 1) {
        if (input.type == "email" || input.type == "phoneNumber") {
            let verification = new otp_Auth({});
            let OTPType = 'numeric';
            let OTP = utils.generateOTP(OTPType, 4);
            let query = {}
            let email;
            let phoneNumber;
            if (input.type === "email") {
                email = input.value;
                query = { email: { $in: input.value } }
            } else if (input.type === "phoneNumber") {
                phoneNumber = input.value;
                query = { phoneNumber: { $in: input.value } }
            }
            user.findOne(query).exec((err, userData) => {
                if (err) {
                    res.status(401).json(utils.getErrorResponse({}, CONSTANTS.STATUS_MESSAGE_FAILURE, CONSTANTS.STATUS_CODE_ERROR))
                } else {
                    if (!userData) {
                        // creating new user if not exist
                        let newUser = new user({});
                        newUser.fullName = input.fullName || "";
                        newUser.email = email;
                        newUser.phoneNumber = phoneNumber;
                        newUser.countryPrefixCode = input.countryPrefixCode ? input.countryPrefixCode : '+91'
                        newUser.appId = input.appId || "";
                        newUser.deviceId = input.deviceId || "";
                        newUser.deviceType = input.deviceType || "";
                        newUser.appVersion = input.appVersion || "";
                        newUser.save((error) => {
                            if (error) {
                                res.status(400).json(utils.getErrorResponse({}, CONSTANTS.MSG_FAILURE, CONSTANTS.CODE_ERROR))
                            }
                        })
                    }
                    verification.OTP = parseInt(OTP)
                    verification.phoneNumber = phoneNumber;
                    verification.email = email;
                    verification.verificationStatus = false;
                    verification.passwordResetToken = false;
                    verification.createdDateTime = new Date();
                    verification.expiryDateTime = new Date(new Date().getTime() + 1000000);
                    verification.updatedDateTime = new Date();
                    verification.save((err, verificationData) => {
                        if (err) {
                            logger.error("Error in saving OTP verfication data for sendOTP", err)
                            res.status(401).json({ code: 0, msg: "Error in saving OTP verfication data for sendOTP" })
                        } else {
                            if (email) {
                                sendEmailToUser(res, verificationData, email, userData);
                            } else if (phoneNumber) {
                                sendotp_Mobile(verificationData, phoneNumber, input);
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
            res.status(401).json({ code: 0, msg: 'email/PhoneNumber is Mandatory' });
        }
    } else {
        res.status(401).json(response);
    }
})

function sendEmailToUser(res, verificationData, email, userData) {
    sendEmail(email, 'OTP - ModuleDevelopment', email, `Dear user ,${verificationData.OTP} is your OTP to access ModuleDevelopment App. This OTP will be valid for 3 minutes.`);
}

function sendotp_Mobile(verificationData, phoneNumber, input) {
    sendSMS(input.countryPrefixCode + phoneNumber, verificationData);
}

/**
* 
* @description Function to validate the sendOTP Api Input Request
* @param {object} response 
* @param {object} input 
* @returns {object}
*/
function sendOTPValidationHandler(response, input) {

    if (!(input.type)) {
        response.code = 0;
        response.msg = 'type cannot be empty'
    } else if (utils.isStringBlank(input.type)) {
        response.code = 0;
        response.msg = 'type cannot be empty'
    } else if (utils.isStringBlank(input.value)) {
        response.code = 0;
        response.msg = 'value cannot be empty'
    } else if (input.type == "phoneNumber" && !(input.countryPrefixCode)) {
        response.code = 0;
        response.msg = 'countryPrefixCode cannot be empty'
    } else if (input.type == "phoneNumber" && utils.isStringBlank(input.countryPrefixCode)) {
        response.code = 0;
        response.msg = 'countryPrefixCode cannot be empty'
    } else if (input.type == "phoneNumber" && !utils.isValidPhoneNumber(input.value)) {
        response.code = 0;
        response.msg = 'Invalid phoneNumber'
    } else if (input.type == "email" && !utils.isValidEmail(input.value)) {
        console.log(!utils.isValidEmail(input.value))
        response.code = 0;
        response.msg = 'Invalid email address'
    } else {
        return response;
    }

}


module.exports = { sendOTP }



