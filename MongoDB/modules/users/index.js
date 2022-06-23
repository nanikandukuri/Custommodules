var router = require('express').Router();
require('express');
var loginController = require('./controllers/login');
var signupController = require('./controllers/userSignup');
var otpController = require('./controllers/sendOTP');
var verifyotpController = require('./controllers/verifyOTP')
var resetpasswordController = require('./controllers/resetpassword')
    , url = require('url')
    , publicIp = require('public-ip')
    , auth = require('../../security/Auth')
    , { RateLimiterMemory } = require('rate-limiter-flexible');

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
router.post('/login', loginController.userLogin);
router.post('/signup', signupController.userSignup);
router.post('/sendOTP', otpController.sendOTP);
router.post('/verifyOTP', verifyotpController.verifyOTP);
router.post('/resetPassword', resetpasswordController.resetPassword);



module.exports = router;