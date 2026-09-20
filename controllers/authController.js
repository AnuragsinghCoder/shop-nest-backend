const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

//register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({name, email, password: hashedPassword});
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const subject = "OTP for shop-nest registration";
            const message = `
            Welcome to shop-nest!, ${name}! 
            Your OTP for shop-nest registration is: ${otp}
            Thank you for using shop-nest!
            `;

            
            user.otp.otp = await bcrypt.hash(otp, 10);
            user.otp.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();
            await sendEmail(email, subject, message);
            return res.status(201).json(
                {
                     message: "User created successfully, To register, please verify your email by filling the OTP",
                     _id: user._id,
                     name: user.name,
                     email:user.email,
                }
            );
        }

    } catch (err) {
        return res.status(500).json({ message: "Error creating user" });
    }
};
        
// Verify OTP
const verifyOTP = async (req, res) => {
    const { otp, email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.otp || !user.otp.otp) {
            return res.status(400).json({
                message: "OTP not found. Please request a new OTP"
            });
        }

        if (user.otp.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        const isValidOTP = await bcrypt.compare(
            otp,
            user.otp.otp
        );

        if (!isValidOTP) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        user.verified = true;

        // Remove OTP after successful verification
        user.otp.otp = undefined;
        user.otp.expiresAt = undefined;

        await user.save();

        return res.status(200).json({
            message: "OTP verified successfully. You can now login."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Error verifying OTP"
        });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        if (!user.verified) {
            return res.status(400).json({
                message: "Please verify your email first"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = await generateToken(user);

        return res.status(200).json({
            message: "User logged in successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Error logging in user"
        });
    }
};

// Logout user
const logoutUser = async (req, res) => {
    try {
        // Clear the token from the request header from the client
        return res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error logging out user"
        });
    }
};

module.exports = { registerUser, loginUser, logoutUser, verifyOTP };
