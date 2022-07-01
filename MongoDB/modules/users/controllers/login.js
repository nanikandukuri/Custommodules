/**
 * @author Nani Kandukuri
 *
 */
let userProfile = require('../../users/models/userProfile'),
    Utils = require('../../../utils/utils'),
    CONSTANTS = require('../../../utils/Constants'),
    logger = require('../../../logger'),
    crypto = require('crypto');


/**
* @description The function haandles the login.user may login with his phonumber and password or email and password.
* @param {object} req 
* @param {object} res 
* @returns {object}
*/
const userLogin = ((req, res) => {
    console.log("login request", req.body)
    console.log("login request", req.headers)
    let input = req.body;
    let response = {
        code: 1,
        msg: 'Success'
    }
    //checking for valid data
    loginValidationsHandler(response, input);
    logger.info("userLogin" + " ::: " + input);

    if (response.code == 1) {
        let query = {}
        let email
        let phoneNumber
        if (input.type === "email") {
            email = input.value;
            query = { email: { $eq: input.value } }
        } else if (input.type === "phoneNumber") {
            phoneNumber = input.value;
            query = { phoneNumber: { $eq: input.value } }
        }
        userProfile.findOne(query).select('-appId -deviceId -deviceType -appVersion -tokens -updateDateTime -createdDateTime ').exec((err, data) => {
            if (err) {
                logger.error('Error finding userdata for login', err);
                res.status(201).json(Utils.getErrorResponse({}, 'Error finding userdata for login', 0));
            } else if (!data) {
                logger.info('No user data found for loging');
                res.status(201).json(Utils.getErrorResponse({}, "User not found", 0,));
            } else if (data) {
                let passwordFields = data.password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                if (hash === passwordFields[1]) {
                    let isEmailVerified = data.isEmailVerified;
                    let isProfileUpdated = data.isProfileUpdated;
                    let isMobileNumberVerified = data.isMobileNumberVerified;
                    let userId = data._id;
                    res.status(200).json({ code: 1, msg: "Login Success!", data: { isEmailVerified, isProfileUpdated, isMobileNumberVerified, userId } })
                } else {
                    res.status(400).json({
                        code: 0,
                        msg: 'Invalid credentials',
                        data: {
                            isEmailVerified: false,
                            isProfileUpdated: false,
                            isMobileNumberVerified: false,
                            userId: ""
                        }
                    })
                }
            }
        })

    } else {
        res.status(400).json(response);
    }
});

/**
* 
* @description Function to validate the User Login Api Input Request
* @param {object} response 
* @param {object} input 
* @returns {object}
*/
function loginValidationsHandler(response, input) {
    if (!(input.type)) {
        response.code = 0;
        response.msg = 'type cannot be empty'
    } else if (!(input.requestType)) {
        response.code = 0;
        response.msg = 'requestType cannot be empty'
    } else if (Utils.isStringBlank(input.requestType)) {
        response.code = 0;
        response.msg = 'requestType cannot be empty'
    } else if (Utils.isStringBlank(input.type)) {
        response.code = 0;
        response.msg = 'type cannot be empty'
    } else if (!CONSTANTS.TYPE.includes(input.type)) {
        response.code = 0;
        response.msg = 'type must be email or phoneNumber'
    } else if (!(input.value)) {
        response.code = 0;
        response.msg = 'value cannot be empty'
    } else if (Utils.isStringBlank(input.value)) {
        response.code = 0;
        response.msg = 'value cannot be empty'
    } else if (input.type == "phoneNumber" && !Utils.isValidPhoneNumber(input.value)) {
        response.code = 0;
        response.msg = 'Invalid phoneNumber'
    } else if (input.type == "email" && !Utils.isValidEmail(input.value)) {
        response.code = 0;
        response.msg = 'Invalid email address'
    } else if (!(input.password)) {
        response.code = 0;
        response.msg = 'password must be provided'
    } else if (input.password && !Utils.ValidatePassword(input.password)) {
        response.code = 0;
        response.msg = 'Password must contain 1 capital letter,1 small letter,1 numeric, 1 special character and length should be min 8 and max 16 letters'
    } else {
        return response;
    }

}


module.exports = {
    userLogin
} 