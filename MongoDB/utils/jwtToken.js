'use strict'
const jwt = require('jsonwebtoken')
const secret_key = require('../config').jwt_secret_key

//Verify user token
exports.verifyJwtToken = function () {
    return function (req, res, next) {
        if (typeof req.headers.authorization !== "undefined") {
            var token = req.headers.authorization.split(" ")[1]
            jwt.verify(token, secret_key, (err, user) => {
                if (err) {
                    res.status(401).json({
                        status: "failed",
                        message: "Not Authorized"
                    })
                } else {
                    req.body.user_id = user.user_id
                    next()
                }
            })
        } else {
            res.status(500).json({
                status: "failed",
                message: "Something went wrong!!"
            })
        }
    }
}