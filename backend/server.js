const express = require("express");
const path = require('path');
const app = express();
require('dotenv').config();
const cors = require('cors');

const connectDB = require("./db/db.js");
const verifyToken = require("./middlewares/auth.js");

const userRoutes = require("./routes/user.routes.js");
const taskRoutes = require("./routes/task.routes.js");

app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// app.use(cors());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.get('/verify', verifyToken, (req, res) => {
    console.log("Token Verified");

    res.status(200).json({
        message: "Logged In Successfully",
        token: req.token,
        user: req.user
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
});

module.exports = app;