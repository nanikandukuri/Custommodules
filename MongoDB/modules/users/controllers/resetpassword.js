const { ObjectId } = require('bson')

var express = require('express'),
    user = require('../../users/models/userProfile'),
    Utils = require('../../../utils/utils')
CONSTANTS = require('../../../utils/Constants'),
    logger = require('../../../logger')
    , crypto = require('crypto')
    , { v4: uuidv4 } = require('uuid')

const resetPassword = ((req, res) => {
    var input = req.body
    logger.info("reset Password" + input.email)
    let response = { code: 1, msg: '' }
    checkValidations(response, input)
    if (response.code == 1) {
        let query = {}
        if (input.type === "email") {
            query = { email: { $eq: input.value } }
        } else if (input.type === "phoneNumber") {
            query = { phoneNumber: { $eq: input.value } }
        }
        user.find(query).sort({ createdDateTime: -1 }).select('password').exec((err, passwordData) => {
            if (err) {
                res.status(401).json(Utils.getErrorResponse({}, "error", "Failure"))
            } else if ((passwordData.length) && !(passwordData[0].password == "" || passwordData[0].password == null)) {
                user.findOneAndUpdate(query,
                    {
                        $set: {
                            password: createHash(input.password)
                        }
                    },
                    { new: true }).select('-appId -deviceId -deviceType -appVersion -password -tokens -updateDateTime -createdDateTime').exec(async (err, userdata) => {
                        if (err) {
                            logger.error("error in updating passwrod" + input.userId, err);
                            res.status(201).json(Utils.getErrorResponse({}, 'error in updating passwrod', 0))
                        } else if (!userdata) {
                            res.status(401).json(Utils.getSuccessResponse({}, 'Invalid user or User not verified', 1))
                        } else {
                            res.status(200).json(Utils.getSuccessResponse({}, "Password updated successfully!", 1))
                        }
                    })
            } else if (passwordData.length) {
                let passwordFields = passwordData[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64")
                if (hash === passwordFields[1]) {
                    res.status(400).json(Utils.getErrorResponse({}, "New password cannot be smae as previous password", 0))
                } else {
                    user.findOneAndUpdate(query,
                        {
                            $set: {
                                password: createHash(input.password)
                            }
                        },
                        { new: true }).select('-appId -deviceId -deviceType -appVersion -password -tokens -updateDateTime -createdDateTime -referralIds').exec(async (err, userdata) => {
                            if (err) {
                                logger.error("error in updating passwrod" + input.userId, err);
                                res.status(201).json(Utils.getErrorResponse({}, 'error in updating passwrod', 0))
                            } else if (!userdata) {
                                res.status(401).json(Utils.getSuccessResponse({}, 'Invalid user or User not verified', 1))
                            } else {
                                res.status(200).json(Utils.getSuccessResponse({}, "Password updated successfully", 1))
                            }
                        })
                }
            } else {
                res.status(401).json(Utils.getErrorResponse({}, "User not found", 0))
            }
        })
    } else {
        res.status(401).json(response)
    }
})


var createHash = (newPassword) => {
    const salt = uuidv4().toString('base64')
    let hash = crypto.createHmac('sha512', salt)
        .update(newPassword)
        .digest("base64");
    newPassword = salt + "$" + hash;
    return newPassword
}

function checkValidations(response, input) {

    if (Utils.isStringBlank(input.type)) {
        response.code = 0;
        response.msg = 'type cannot be empty'
    } else if (Utils.isStringBlank(input.value)) {
        response.code = 0;
        response.msg = 'value cannot be empty'
    } else if (input.type == "phoneNumber" && !Utils.isValidPhoneNumber(input.value)) {
        response.code = 0;
        response.msg = 'Invalid phoneNumber'
    } else if (input.type == "email" && !Utils.isValidEmail(input.value)) {
        response.code = 0;
        response.msg = 'Invalid email address'
    } else {
        return response;
    }

}


module.exports = {
    resetPassword
}