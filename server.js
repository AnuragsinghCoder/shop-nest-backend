// requring dotenv and loading .env file
const dotenv = require("dotenv");
dotenv.config();

// requiring express and creating app
const express = require("express");
const app = express();

//requring db connection and connecting to db
const connectDB = require("./config/db");
connectDB();

// requiring cors and adding it to app
const cors = require("cors");
app.use(cors());


// checking the health of the server and sending response
app.get("/health", (req, res) => {
    res.send("server is running");
});

//adding json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//adding routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

// intializing port number from .env file and starting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

