const jwt = require('jsonwebtoken');
const Clg = require("../model/clgSchema");

const clgauthenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwt_token;
        console.log("Token:", token);
        const verifyToken = jwt.verify(token, process.env.CLGSECRET_KEY);
        console.log("Decoded token:", verifyToken);
        const rootUser = await Clg.findOne({ 
            _id: verifyToken._id,
            tokens: { $elemMatch: { token: token } }
        });
        console.log("Root user:", rootUser);
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

module.exports = clgauthenticate;
