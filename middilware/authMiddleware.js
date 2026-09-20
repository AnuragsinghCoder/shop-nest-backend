// protected route
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        const token = authHeader.split(" ")[1];
        if (authHeader && token) {
            const user = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            next();
        } else {
            res.status(401).json({ message: "invalid token" });
        }
    } catch (err) {
        if(!authHeader){
            res.status(401).json({ message: "No token provided" });
        }

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

// admin middleware

const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied. Admin only."
        });
    }
};

module.exports = {
    protect,
    admin,

}