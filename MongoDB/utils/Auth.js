var Utils = require('../utils/utils'),
    crypto = require("crypto"),
    utf8 = require('utf8'),
    secretKey = 'ModuleDev!123@*#',
    secretKey2 = "@#*Gemini&#Q";




//verify Request hash
exports.verifyHash = function () {
    return function (req, res, next) {
        if (req.headers.isauth == 'false') {
            next()
        } else {
            var hash = req.headers.auth
            var inputString = {}
            if (req.method == 'GET') {
                inputString = JSON.stringify(req.query)
            } else {
                inputString = JSON.stringify(req.body)
            }
            inputString = inputString.replace(/\"/g, '')
            inputString = inputString.replace(/\,/g, ', ')
            inputString = inputString.replace(/\,  /g, ', ')
            inputString = inputString.replace(/\:/g, ': ')
            inputString = inputString.replace(/\: \//g, ':/')

            const new_hash = crypto.createHash('sha256').update(utf8.encode(inputString + secretKey + secretKey2)).digest('hex');

            if (hash == new_hash) {
                next()
            } else {
                res.status(401).json(Utils.getErrorResponse({}, 'Invalid Auth key'))
            }
        }

    }
}

exports.newHashing = function () {
    return function (req, res, next) {
        var hash = req.headers.auth
        var inputString = {}
        if (req.method == 'GET') {
            inputString = JSON.stringify(req.query)
        } else {
            inputString = JSON.stringify(req.body)
        }
        inputString = inputString.replace(/\"/g, '')
        inputString = inputString.replace(/\,/g, ', ')
        inputString = inputString.replace(/\,  /g, ', ')
        inputString = inputString.replace(/\:/g, ': ')
        inputString = inputString.replace(/\: \//g, ':/')

        const new_hash = crypto.createHash('sha256').update(utf8.encode(secretKey + secretKey2)).digest('hex');

        if (hash == new_hash) {
            next()
        } else {
            res.status(401).json(Utils.getErrorResponse({}, 'Invalid Auth key'))
        }
    }
}
