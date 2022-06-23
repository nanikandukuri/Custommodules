var express = require('express'),
    router = express(),
    UserSignUp = require('../../users/models/userProfile'),
    Utils = require('../../../utils/utils'),
    CONSTANTS = require('../../../utils/Constants'),
    verificationModel = require('../../users/models/otpAuthorization'),
    logger = require('../../../logger'),
    ObjectId = require('mongodb').ObjectID;

const verifyOTP = ((req, res) => {
    var input = req.body
    var response = { code: CONSTANTS.CODE_SUCCESS, msg: CONSTANTS.MSG_SUCCESS }
    vaidateData(input, response)
    if (response.code == 1) {
        var query = {}
        var email;
        var phoneNumber;
        if (input.type === CONSTANTS.EMAIL) {
            email = input.value
            query = { email: { $eq: input.value } }
        } else if (input.type === CONSTANTS.PHONENUMBER) {
            phoneNumber = input.value
            query = { phoneNumber: { $eq: input.value } }
        }
        verificationModel.find(query)
            .sort({ createdDateTime: -1 }).exec(function (err, data) {
                if (err) {
                    logger.error(CONSTANTS.MSG_FIND_OTP_ERROR, err)
                    res.status(400).json(Utils.getErrorResponse({}, CONSTANTS.MSG_FIND_OTP_ERROR, CONSTANTS.MSG_FAILURE))
                } else if (!data) {
                    logger.info("No OTP data for verfication")
                    res.status(404).json(Utils.getSuccessResponse({}, CONSTANTS.MSG_NO_OTP_DATA, CONSTANTS.MSG_FAILURE))
                } else if (data[0]) {
                    if (new Date() > data[0].expiryDateTime) {
                        logger.info("OTP has been expired")
                        res.status(201).json(Utils.getErrorResponse({}, CONSTANTS.MSG_OTP_EXPIRED, CONSTANTS.MSG_FAILURE))
                    } else if (data[0].OTP === parseInt(input.OTP)) {
                        verificationModel.findOneAndUpdate({ _id: data[0]._id, verificationStatus: false }, {
                            $set: {
                                verificationStatus: true,
                                updateDateTime: new Date()
                            }
                        }, { new: true }).exec((err, otpData) => {
                            if (err) {
                                logger.error('Error updating verificationStatus', err)
                                res.status(400).json(Utils.getErrorResponse({}, 'Error updating verificationStatus', 0))
                                return;
                            } else if (!otpData) {
                                logger.info('No otp data for opt verificationStatus')
                                res.status(400).json(Utils.getErrorResponse({}, "No otp data to update verfication status", 0))
                                return;
                            } else {
                                if (input.requestType == "signup") {
                                    let query;
                                    let cond;
                                    if (email) {
                                        query = { email: { $in: email } }
                                        cond = {
                                            $set: {
                                                isEmailVerified: true,
                                                updateDateTime: new Date()
                                            }
                                        }
                                    }
                                    if (phoneNumber) {
                                        query = { phoneNumber: { $in: phoneNumber } }
                                        cond = {
                                            $set: {
                                                isMobileNumberVerified: true,
                                                updateDateTime: new Date()
                                            }
                                        }
                                    }

                                    UserSignUp.updateOne(query, cond, { new: true }).select('-appId -deviceId -deviceType -appVersion -password -tokens -updateDateTime -createdDateTime -referralIds').exec(async (err, data) => {
                                        if (err) {
                                            logger.error('Error updating email verfication status in userprofile')
                                            res.status(201).json(Utils.getErrorResponse({}, 'Error in verfication of email', 0))
                                            return false;
                                        } else if (!data) {
                                            logger.info('No user data to update verfication status')
                                            res.status(200).json(Utils.getSuccessResponse({}, "No data for verfication", 1));
                                            return false;
                                        } else {
                                            let userId = data._id
                                            let isEmailVerified = data.isEmailVerified
                                            let isMobileNumberVerified = data.isMobileNumberVerified
                                            res.status(200).json(Utils.getSuccessResponse({ userId, isEmailVerified, isMobileNumberVerified }, "Verified successfully", 1))
                                        }
                                    })
                                } else {
                                    let query;
                                    if (email) {
                                        query = { email: { $eq: email } }
                                    }
                                    if (phoneNumber) {
                                        query = { phoneNumber: { $eq: phoneNumber } }
                                    }
                                    UserSignUp.find(query).select('-appId -deviceId -deviceType -appVersion -password -tokens -updateDateTime -createdDateTime -referralIds').exec(async (err, data) => {
                                        if (err) {
                                            logger.error('Error updating email verfication status in userprofile')
                                            res.status(201).json(Utils.getErrorResponse({}, 'Error in verfication of email', 0))
                                            return false;
                                        } else if (!data.length) {
                                            logger.info('No user data to update verfication status')
                                            res.status(200).json(Utils.getSuccessResponse({}, "No data for verfication", 0));
                                            return false;
                                        } else {
                                            let userId = data[0]._id
                                            let isEmailVerified = data[0].isEmailVerified
                                            let isMobileNumberVerified = data[0].isMobileNumberVerified
                                            res.status(200).json(Utils.getSuccessResponse({ userId, isEmailVerified, isMobileNumberVerified }, "Success", 1))
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        res.status(400).json(Utils.getErrorResponse({}, "Invalid OTP", 0))
                    }
                } else {
                    res.status(400).json(Utils.getErrorResponse({}, 'No verfication data found', 0))
                }
            })
    } else {
        res.status(400).json(response)
    }
})

// handling validations
let vaidateData = (input, response) => {
    if (Utils.isNull(input.OTP)) {
        response.code = 0;
        response.msg = 'OTP Cannot be empty or invalid OTP'
    } else if (!(input.type)) {
        response.code = 0;
        response.msg = 'type Cannot be empty'
    } else if (Utils.isStringBlank(input.type)) {
        response.code = 0;
        response.msg = 'type Cannot be empty'
    } else if (!CONSTANTS.TYPE.includes(input.type)) {
        response.code = 0;
        response.msg = 'type must be email or phoneNumber'
    } else if (!(input.requestType)) {
        response.code = 0;
        response.msg = 'requestType Cannot be empty'
    } else if (Utils.isStringBlank(input.requestType)) {
        response.code = 0;
        response.msg = 'requestType Cannot be empty'
    } else if (input.type == "email" && Utils.isStringBlank(input.value)) {
        response.code = 0;
        response.msg = 'Email Cannot be empty'
    } else if (input.type == "email" && !Utils.isValidEmail(input.value)) {
        response.code = 0;
        response.msg = 'Invalid email address'
    } else if (input.type == "phoneNumber" && Utils.isStringBlank(input.value)) {
        response.code = 0;
        response.msg = 'phoneNumber Cannot be empty'
    } else if (input.type == "phoneNumber" && !Utils.isValidPhoneNumber(input.value)) {
        response.code = 0;
        response.msg = 'Invalid PhoneNumber'
    } else {
        return response
    }

}

module.exports = {
    verifyOTP
}