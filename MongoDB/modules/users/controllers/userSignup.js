
var userSignUp = require('../../users/models/userProfile'),
    bcrypt = require('bcrypt-nodejs'),
    Utils = require('../../../utils/utils'),
    CONSTANTS = require('../../../utils/Constants'),
    logger = require('../../../logger'),
    crypto = require('crypto'),
    { v4: uuidv4 } = require('uuid');
// meaning full comments
// better to maintain semicolon at end of statements
// meaning full function name for validating functions
const userSignup = ((req, res) => {
    let input = req.body;
    let response = { code: 1, msg: '' }
    checkValidations(response, input) //checking for valid data
    logger.info('userSignUp API email:-' + input.email + input.phoneNumber)
    if (response.code == 1) {
        var query = {}
        if (input.email || input.phoneNumber) {
            query = {
                $or: [
                    { email: { $eq: input.email ? input.email : '' } },
                    { phoneNumber: { $eq: input.phoneNumber ? input.phoneNumber : '' } }
                ]
            }
        }
        userSignUp.findOne(query).exec((err, userVerification) => {
            if (err) {
                logger.err('Error in fetching user data for' + input.email + ' in userSignUp Api ->', err)
                res.status(401).json(Utils.getErrorResponse({}, "", CONSTANTS.CODE_ERROR))
            } else if (userVerification) {
                if ((userVerification.email == input.email) && (userVerification.phoneNumber == input.phoneNumber)) {
                    userId = userVerification._id
                    isEmailVerified = userVerification.isEmailVerified
                    isMobileNumberVerified = userVerification.isMobileNumberVerified
                    isProfileUpdated = userVerification.isProfileUpdated
                    res.status(200).json({ code: 1, msg: "User already registered", data: { userId, isEmailVerified, isMobileNumberVerified, isProfileUpdated } })
                } else {
                    let userId = userVerification._id
                    let isProfileUpdated = userVerification.isProfileUpdated
                    let isEmailVerified;
                    let isMobileNumberVerified;
                    let existType;
                    if (userVerification.email != input.email) {
                        isEmailVerified = false
                        existType = CONSTANTS.EMAIL
                    } else {
                        isMobileNumberVerified = false;
                        existType = CONSTANTS.PHONENUMBER
                    }
                    res.status(400).json({ code: 0, msg: `Your ${existType} is already associated with different account, Please try to signup with  different ${existType}`, data: { userId, isEmailVerified, isMobileNumberVerified, isProfileUpdated } })
                }
            } else {
                let newUser = new userSignUp({})
                newUser.fullName = input.fullName || ""
                newUser.email = input.email
                newUser.phoneNumber = input.phoneNumber
                newUser.countryPrefixCode = input.countryPrefixCode
                newUser.appId = input.appId || ""
                newUser.deviceId = input.deviceId || ""
                newUser.deviceType = input.deviceType || ""
                newUser.appVersion = input.appVersion || ""
                newUser.password = createHash(input.password);
                newUser.save((error, userData) => {
                    if (error) {
                        logger.error('Error in saving user data in User Sign Up Api:-' + input.email, err);
                        res.status(400).json(Utils.getErrorResponse({}, CONSTANTS.MSG_FAILURE, CONSTANTS.CODE_ERROR))
                    } else {
                        let userId = userData._id
                        let isEmailVerified = userData.isEmailVerified
                        let isMobileNumberVerified = userData.isMobileNumberVerified
                        res.status(200).json(Utils.getSuccessResponse({ userId, isEmailVerified, isMobileNumberVerified }, CONSTANTS.SIGNUP_SUCCESS, CONSTANTS.CODE_SUCCESS))
                    }
                })
            }
        })

    } else {
        res.status(400).json(response)
    }
})

// generate password with uuid and create slat merging salt and hash with $
var createHash = (password) => {
    const salt = uuidv4().toString('base64')
    let hash = crypto.createHmac('sha512', salt)
        .update(password)
        .digest("base64");
    password = salt + "$" + hash;
    return password

};

/**
* 
* @description Function to validate the User Signup Api Input Request
* @param {object} response 
* @param {object} input 
* @returns {object}
*/
function checkValidations(response, input) {

    if (Utils.isStringBlank(input.fullName)) {
        response.code = 0;
        response.msg = 'fullName cannot be empty'
    } else if (Utils.isStringBlank(input.password)) {
        response.code = 0;
        response.msg = 'Password cannot be empty'
    } else if (input.fullName.trim().length < 3) {
        response.code = 0;
        response.msg = 'fullName must be atleast 3 characters'
    } else if (input.fullName.trim().length > 30) {
        response.code = 0;
        response.msg = 'fullName length is out of range more than 30 chareters'
    } else if (Utils.isStringBlank(input.email)) {
        response.code = 0;
        response.msg = 'email cannot be empty'
    } else if (input.email && !Utils.isValidEmail(input.email)) {
        response.code = 0;
        response.msg = 'Invalid email address'
    } else if (Utils.isStringBlank(input.countryPrefixCode)) {
        response.code = 0;
        response.msg = 'countryPrefixCode cannot be empty'
    } else if (Utils.isStringBlank(input.phoneNumber)) {
        response.code = 0;
        response.msg = 'phoneNumber cannot be empty'
    } else if (input.phoneNumber && !Utils.isValidPhoneNumber(input.phoneNumber)) {
        response.code = 0;
        response.msg = 'Invalid phoneNumber'
    } else if (input.password && !Utils.ValidatePassword(input.password)) {
        response.code = 0;
        response.msg = 'Password must contain 1 capital letter,1 small letter,1 numeric, 1 special character and length should be min 8 and max 16 letters'
    } else {
        return response;
    }

}

module.exports = {
    userSignup
}