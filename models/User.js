const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    otp: {
        otp: {
            type: String,
            default: null
        },
        expiresAt: {
            type: Date,
            default: null
        }
    }
});

module.exports = mongoose.model("User", userSchema);