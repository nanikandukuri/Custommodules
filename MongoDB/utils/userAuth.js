const logger = require('../../logger');
const UserSignUp = require('../../mongoDB/schemas/userSchema/userProfile')
    , Utils = require('../../routes/utils'),
    ObjectId = require('mongodb').ObjectID

function Validate(req, res, next) {
    let userId = req.body.userId || req.query.userId
    if (userId) {
        UserSignUp.findOne({ _id: ObjectId(userId) }, function (err, data) {
            if (err) {
                logger.error('User Details Find Error', err);
                res.status(404).json(Utils.getErrorResponse(err))
                return;
            } else if (!data) {
                logger.debug("Invalid user or User not verified");
                res.status(400).json(Utils.getErrorResponse('Invalid user or User not verified'))
                return;
            } else {
                if (data.isMobileNumberVerified == true || data.isEmailVerified == true) {
                    req.userData = data;
                    next()
                } else {
                    res.status(400).json(Utils.getErrorResponse('UserId is Mandatory'))
                }
            }
        })
    } else {
        res.status(400).json(Utils.getErrorResponse('UserId is Mandatory'))
    }
}

function ValidateUser(req, res, next) {
    Validate(req, res, next)
}

module.exports = ValidateUser