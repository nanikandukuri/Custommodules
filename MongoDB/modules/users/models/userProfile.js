var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const {EMPTYSTRING} = require()

// var goalENUM = ["getFit", "looseWeight"]
var userSchema = new Schema({
    profileImage: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    referenceCode: { type: String, default: "" },
    referalCode: { type: String, default: "" },
    referralIds: [{ type: String, default: "" }],
    password: { type: String, default: "" },
    gender: { type: String, default: "" },
    countryPrefixCode: { type: String, default: "" },
    appId: { type: String, default: "" },
    deviceId: { type: String, default: "" },
    deviceType: { type: String, default: "" },
    appVersion: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    isMobileNumberVerified: { type: Boolean, default: false },
    isProfileUpdated: { type: Boolean, default: false },
    isValiedUser: { type: Boolean, default: false },
    createdDateTime: { type: Date, default: new Date() },
    updateDateTime: { type: Date, default: new Date() },
    tokens: [String],
    loginType: { type: String, enum: ['Email', 'PhoneNumber', 'Gmail', 'Facebook', 'Apple'] },
    socialAuthKey: { type: String, default: "" },
    DateOfBirth: { type: String, default: "" },

}, { versionKey: false, collection: "userprofiles" });

var UserModel = mongoose.model('userprofiles', userSchema);

module.exports = UserModel;