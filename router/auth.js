const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require("../model/userSchema")
const authenticate = require("../middleware/authenticate")
const cors = require('cors');
const Apply = require("../model/ApplySchema"); // Import the Apply schema
const cookieParser = require('cookie-parser');
router.use(cookieParser());
// router.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true 
// }));
// router.use(cors()); 
router.use(cors({
    origin: 'https://faculty-recruitment-and-monitoring-system-frontend-anbfs3l70.vercel.app',
    credentials: true 
}));

router.get('/',(req,res)=>{
    res.send(`hi hello router`);
});
router.post('/register', async (req, res) => {
    const { name, email, phone, qualification,experience, password, cpassword } = req.body;
    if ( !name || !email || !phone || !qualification || !experience || !password ||!cpassword) {
        return res.status(422).json({ error: "Please fill in all the fields properly" });
    }

    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }

        const user = new User({ name, email, phone, qualification,experience, password, cpassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to register" });
    }
});
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide both email and password" });
        }

        // Find user by email
        const userLogin = await User.findOne({ email: email });
        if (!userLogin) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate auth token
        const token = await userLogin.generateAuthToken();

        // Set JWT token cookie
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000), // Expires in 1 year
            httpOnly: true,
            // You may want to add secure: true if you're using HTTPS
        });

        
        

        // Send success response
        res.json({ message: "User signed in successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/aboutpage', authenticate, (req, res) => {
    console.log("hi about");
    res.send(req.rootUser);
});
router.get('/getdata', authenticate, (req, res) => {
    console.log("hi getdata");
    res.send(req.rootUser);
});
router.get('/getusername', authenticate, (req, res) => {
    console.log("hi homee");
    res.send(req.rootUser);
});
router.get('/log-out', (req, res) => {
    console.log("hi logout");
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send("User logout");
});


router.patch('/update-details', authenticate, async (req, res) => {
    try {
        const { name, email, experience, password } = req.body;
        const user = req.rootUser;

        // Check if name is provided and update if exists
        if (name) {
            user.name = name;
        }

        // Check if email is provided and update if exists
        if (email) {
            // Check if the provided email is already used by another user
            const userExist = await User.findOne({ email: email });
            if (userExist && userExist._id.toString() !== user._id.toString()) {
                return res.status(422).json({ error: "Email already exists" });
            }
            user.email = email;
        }

        // Check if experience is provided and update if exists
        if (experience) {
            user.experience = experience;
        }

        // Check if password is provided and update if exists
        if (password) {
            user.password = password;
        }

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: "User details updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.patch('/update-name', authenticate, async (req, res) => {
    try {
        const { name } = req.body;
        const user = req.rootUser;

        // Check if name is provided and update if exists
        if (name) {
            user.name = name;
        }

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: "Name updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.patch('/update-phone', authenticate, async (req, res) => {
    try {
        const { phone } = req.body;
        const user = req.rootUser;

        // Check if phone number is provided and update if exists
        if (phone) {
            user.phone = phone;
        }

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: "Phone number updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.patch('/update-email', authenticate, async (req, res) => {
    try {
        const { email } = req.body;
        const user = req.rootUser;

        // Check if email is provided and update if exists
        if (email) {
            // Check if the provided email is already used by another user
            const userExist = await User.findOne({ email: email });
            if (userExist && userExist._id.toString() !== user._id.toString()) {
                return res.status(422).json({ error: "Email already exists" });
            }
            user.email = email;
        }

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: "Email updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.patch('/update-experience', authenticate, async (req, res) => {
    try {
        const { experience } = req.body;
        const user = req.rootUser;

        // Check if experience is provided and update if exists
        if (experience) {
            user.experience = experience;
        }

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: "Experience updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.patch('/update-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.rootUser;

        // Check if both current and new passwords are provided
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Please provide both current and new passwords" });
        }

        // Compare the current password with the stored password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect current password" });
        }

        // Update the password with the new password
        user.password = newPassword;

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;