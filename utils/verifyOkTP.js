const User = require("../models/User");
const sendEmail = require("./sendEmail");

const verifyOTP = async (otp) => {
    try {
        const user = await User.findOne({ otp });
        if (user) {
            if (user.otp === otp) {
                user.verified = true;
                await user.save();
                return true;
            }
            return false;
        }
    } catch (err) {
        return false;
    }
};

module.exports = verifyOTP;