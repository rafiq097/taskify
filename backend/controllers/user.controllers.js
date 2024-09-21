const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const signupUser = async (req, res) => {
    try {
        console.log(req.body);
        const { email, fullname, password } = req.body;

        if (!email || !fullname || !password)
            return res.status(400).json({ message: "Incorrect Details" });

        const user = await User.create({ email, fullname, password });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, fullname: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            message: "Registered  Successfully",
            token,
            user: {
                userId: user._id, email: user.email, fullname: user.fullname
            }
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Incorrect Details" });


        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "No User found!" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, fullname: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            message: "Logged In Successfully",
            token,
            user: {
                userId: user._id, email: user.email, fullname: user.fullname
            }
        });
    }

    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { signupUser, loginUser };