var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var otpSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'userProfile' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    OTP: Number,
    verificationStatus: { type: Boolean, default: false },
    expiryDateTime: Date,
    createdDateTime: { type: Date, default: new Date() },
    updatedDateTime: { type: Date, default: new Date() },
    passwordResetToken: { type: Boolean, default: false }

}, { versionKey: false, collection: "otpauths" });

var UserModel = mongoose.model('otpauths', otpSchema);

module.exports = UserModel;