const express = require("express");
const router = express.Router();
const{ registerUser, loginUser, logoutUser, verifyOTP, getAllUsers } = require("../controllers/authController");

const { protect, admin } = require("../middilware/authMiddleware");

const test = (req, res) => {
    res.send({ message: "everything is good" });
};

const test1 = (req, res) => {
    res.send({ message: "everything is good" });
};

router.post("/register", registerUser);
router.post("/verifyotp", verifyOTP);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/test", protect, admin, test);
router.get("/users", protect, admin, getAllUsers);


module.exports = router;
