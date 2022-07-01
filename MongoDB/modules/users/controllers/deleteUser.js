/**
 * @author Nani Kandukuri
 *
 */
var userSignUp = require('../../users/models/userProfile'),
    Utils = require('../../../utils/utils'),
    CONSTANTS = require('../../../utils/Constants'),
    logger = require('../../../logger'),
    crypto = require('crypto'),
    { v4: uuidv4 } = require('uuid');

/**
* @description deleteuser function used to delete existed user from db.
creating the new user with the input details and saving password in hash code
* @param {object} req 
* @param {object} res 
* @returns {object}
*/
let deleteUser = ((req, res) => {
    let input = req.body;
    let response = { code: 1, msg: '' }
    signupValidationHandler(response, input) //checking for valid data
    logger.info('delete user API email:-' + " ::: " + input.email + input.phoneNumber)
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
        userSignUp.findOneAndDelete(query).exec((err, data) => {
            if (err) {
                logger.err('Error in fetching user data for' + input.email + ' in userSignUp Api ->', err)
                res.status(401).json(Utils.getErrorResponse({}, "", CONSTANTS.CODE_ERROR))
            } else if (data) {
                res.status(200).json({ code: 1, msg: "Account deleted Successfully", data: {} })
            } else {
                res.status(404).json({ code: 0, msg: "Account not found", data: {} })
            }
        })

    } else {
        res.status(400).json(response)
    }
})



/**
* 
* @description Function to validate the delete User  Api Input Request
* @param {object} response 
* @param {object} input 
* @returns {object}
*/
function signupValidationHandler(response, input) {
    if (input.email && !Utils.isValidEmail(input.email)) {
        response.code = 0;
        response.msg = 'Invalid email address'
    } else if (input.phoneNumber && !Utils.isValidPhoneNumber(input.phoneNumber)) {
        response.code = 0;
        response.msg = 'Invalid phoneNumber'
    } else {
        return response;
    }

}

module.exports = {
    deleteUser
}