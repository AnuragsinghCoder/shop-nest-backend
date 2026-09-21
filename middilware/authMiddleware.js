// // protected route
// const jwt = require("jsonwebtoken");

// const protect = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     try {
//         const token = authHeader.split(" ")[1];
//         if (authHeader && token) {
//             const user = await jwt.verify(token, process.env.JWT_SECRET);
//             req.user = user;
//             console.log(req.user);
//             next();
//         } else {
//             res.status(401).json({ message: "invalid token" });
//         }
//     } catch (err) {
//         if(!authHeader){
//             res.status(401).json({ message: "No token provided" });
//         }

//         return res.status(401).json({
//             message: "Invalid or expired token"
//         });
//     }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized. No token."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("Protect middleware error:", error);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};


// admin middleware
// this middleware should be used only for protected routes that require admin access
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({
            message: "Access denied. Admin only."
        });
    }
};

module.exports = {
    protect,
    admin
}