var router = require('express').Router();
require('express');
var loginController = require('./controllers/login');
var signupController = require('./controllers/userSignup');
var otpController = require('./controllers/sendOTP');
var verifyotpController = require('./controllers/verifyOTP');
var deleteUserController = require('./controllers/deleteUser');
var resetpasswordController = require('./controllers/resetpassword')
    , url = require('url')
    , publicIp = require('public-ip')
    , { RateLimiterMemory } = require('rate-limiter-flexible'),
    auth = require('../../utils/Auth');

let rateLimiter = new RateLimiterMemory(
    {
        points: 10,
        duration: 300,
        blockDuration: 1 * 60 * 60 // after 1 hour api revert 
    });

let LoginrateLimiter = (req, res, next) => {
    var key = '';
    if (req.body.email) {
        key = req.body.email
    } else {
        key = req.body.phoneNumber
    }
    rateLimiter.consume(key)
        .then(() => {
            next();
        }).catch((err) => {
            if (err) {
                res.status(401).json(utils.getErrorResponse({}, err));
            } else {
                res.status(401).json(utils.getErrorResponse({}, "Failure", 'You have exceeded maximum number of attempts. Please try after 1 hour'));
            }
        });
};
router.post('/login', auth.verifyHash(), loginController.userLogin);
router.post('/signup', auth.verifyHash(), signupController.userSignup);
router.post('/sendOTP', auth.verifyHash(), otpController.sendOTP);
router.post('/verifyOTP', auth.verifyHash(), verifyotpController.verifyOTP);
router.post('/resetPassword', auth.verifyHash(), resetpasswordController.resetPassword);
router.post('/deleteUser', auth.verifyHash(), deleteUserController.deleteUser);



module.exports = router;