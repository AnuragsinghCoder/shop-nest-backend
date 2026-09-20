const jwt = require("jsonwebtoken");

const generateToken = async (user) => {
    try {
        const payload = {
            id: user.id,
            name: user.name,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return token;
    } catch (err) {
        return err;
    }
};

module.exports = generateToken;