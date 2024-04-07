const jwt = require('jsonwebtoken');
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        console.log("Token:", token); // Log the token to verify its value
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Decoded token:", verifyToken); // Log the decoded token
        const rootUser = await User.findOne({ 
            _id: verifyToken._id,
            tokens: { $elemMatch: { token: token } }
        });
        console.log("Root user:", rootUser); // Log the root user object
        if (!rootUser) {
            throw new Error("User not found");
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    } catch (err) {
        res.status(401).send('Unauthorized: token');
        console.log(err);
    }
}

module.exports = authenticate;
