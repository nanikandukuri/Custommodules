
var mongoose = require('mongoose');

var utils = {
    isStringBlank: function (val) {
        if (typeof val === 'string')
            return !(val && val.trim().length != 0);
        else return true;
    },
    isArrayBlank: function (val) {
        if (val instanceof Array)
            return !(val.length != 0);
        else return true;
    },
    dateInUTC: function () {
        var now = new Date();
        var now_utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return now_utc;
    },
    isStringType: function (obj) {
        return typeof obj === 'string';
    },
    isArrayType: function (obj) {
        return Array.isArray(obj);
    },
    isObjectType: function (obj) {
        return ((obj === Object(obj)) && !isArrayType(obj));
    },
    isValidObjectID: function (obj) {
        return mongoose.Types.ObjectId.isValid(obj)
    },
    isNull: function (obj) {
        if (obj)
            return false;
        else return true;
    },
    isBoolean: function (val) {
        if (typeof (val) === "boolean") {
            return true;
        }
        if (val == 'true') {
            return true;
        } else if (val == 'false') {
            return true;
        } else {
            return false;
        }
    },
    isMobileNumber: function (value) {
        var reg = /^\+[0-9]{1}[0-9]{5,15}$/;
        if (!(reg.test(value)))
            return false
        else return true;
    },
    isAlphabetletters: function (value) {
        var reg = /^[A-Za-z\s]+$/;
        if (!(reg.test(value)))
            return false
        else return true;
    },
    isValidPhoneNumber: function (value) {
        var reg = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
        if (!(reg.test(value)))
            return false
        else return true;
    },
    convert: function (d) {

        var now = new Date(d);
        var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return now_utc;
    },
    compare: function (a, b) {
        return (
            isFinite(a = this.convert(a).valueOf()) &&
                isFinite(b = this.convert(b).valueOf()) ?
                (a > b) - (a < b) :
                NaN
        );
    },
    inRange: function (d, start, end) {
        return (
            isFinite(d = this.convert(d).valueOf()) &&
                isFinite(start = this.convert(start).valueOf()) &&
                isFinite(end = this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
        );
    },
    validateDate: function (value) {
        var reg = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
        if (!(reg.test(value)))
            return false
        else return true;
    },
    isValidEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(String(email).toLowerCase());
    },
    ValidatePassword(password) {
        if (password.match(/[a-z]/g) && password.match(
            /[A-Z]/g) && password.match(
                /[0-9]/g) && password.match(
                    /[^a-zA-Z\d]/g) && password.length >= 8 && password.length <= 16) {
            return true
        } else {
            return false
        }
    },
    GetFormattedDate: function () {
        var todayTime = new Date();
        var month = todayTime.getMonth() + 1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        var hours = todayTime.getHours();
        var minutes = todayTime.getMinutes();
        var seconds = todayTime.getSeconds();
        if (month.toString().length < 2)
            month = "0" + month;
        if (day.toString().length < 2)
            day = "0" + day;
        if (hours.toString().length < 2)
            hours = "0" + hours;
        if (minutes.toString().length < 2)
            minutes = "0" + minutes;
        if (seconds.toString().length < 2)
            seconds = "0" + seconds;
        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    },
    getSuccessResponse: function (data = [], msg = "", code = 1) {
        return { code, msg, data }
    },
    getFailureResponse: function (data = [], msg = "", code = 0) {
        return { code, msg, data }
    },
    getErrorResponse: function (data = [], msg = "", code = 0) {
        return { code, msg, data }
    },

    isEmptyObj: function (object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }
}
module.exports = utils;
