const jwt = require('jsonwebtoken');
const Clg = require("../model/clgSchema");

const clgpostauth = async (req, res, next) => {
    try {
        // Extract token from cookie
        const token = req.cookies.jwt_token;

        if (!token) {
            throw new Error('Token not found in cookie');
        }

        // Verify the token
        const verifyToken = jwt.verify(token, process.env.CLGSECRET_KEY);
        console.log("Decoded token:", verifyToken);

        // Find user associated with the token
        const rootUser = await Clg.findOne({ 
            _id: verifyToken._id,
            tokens: { $elemMatch: { token: token } }
        });

        if (!rootUser) {
            throw new Error("User not found");
        }

        // Attach token, rootUser, and userID to the request object
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        // Call next middleware
        next();

    } catch (err) {
        // Handle errors
        res.status(401).send('Unauthorized: token');
        console.error(err);
    }
}

module.exports = clgpostauth;
