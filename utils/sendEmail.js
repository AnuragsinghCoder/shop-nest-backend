const nodemailer = require("nodemailer");

//console.log("EMAIL_USER:", process.env.EMAIL_USER);
//console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, body) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: body,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (err) {
        console.log(err);
    }
};

module.exports = sendEmail;