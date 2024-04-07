const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Clg = require("../model/clgSchema")
const authenticate = require("../middleware/clgauthenticate")
const cors = require('cors');
const Postjob = require("../model/PostJobSchema");
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));

router.post('/clg-register', async (req, res) => {
    const { clgname, clgemail, clgphone, clgcode, password, cpassword } = req.body;
    if ( !clgname || !clgemail || !clgphone || !clgcode  || !password ||!cpassword) {
        return res.status(422).json({ error: "Please fill in all the fields properly" });
    }

    try {
        const userExist = await Clg.findOne({ clgemail: clgemail });
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }

        const clg = new Clg({clgname, clgemail, clgphone, clgcode, password, cpassword });
        await clg.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to register" });
    }
});
router.post('/clg-signin', async (req, res) => {
    try {
        const { clgemail,clgcode, password } = req.body;

        // Check if email and password are provided
        if (!clgemail || !password || !clgcode) {
            return res.status(400).json({ error: "Please provide both email and password" });
        }

        // Find user by email
        const userLogin = await Clg.findOne({ clgemail: clgemail });
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
        res.cookie("jwt_token", token, {
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

// getclgusername
router.get('/getclgusername', authenticate, (req, res) => {
    console.log("hi clg name");
    res.send(req.rootUser);
});

// router.post('/postingjob', authenticate, async (req, res) => {
//     const { postavailable, qualification, experience, department, jobid, date } = req.body;

//     if (!postavailable || !qualification || !experience || !department || !jobid || !date) {
//         return res.status(400).json({ error: "Please fill all the details" });
//     }

//     try {
//         // Use req.userID to associate the job posting with the authenticated user
//         const detail = new Postjob({ 
//             postavailable, 
//             qualification, 
//             experience, 
//             department, 
//             jobid, 
//             date,
//             postedBy: req.userID // Associate the job with the authenticated user
//         });

//         await detail.save();
//         res.status(201).json({ message: "Job saved successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// });




router.get('/clg-log-out', (req, res) => {
    console.log("hi logout");
    res.clearCookie('jwt_token',{path:'/'});
    res.status(200).send("User logout");
});


router.patch('/update-clgname', authenticate, async (req, res) => {
    try {
        const { newName } = req.body;
        const user = req.rootUser;

        if (newName) {
            user.clgname = newName;
        }

        await user.save();

        res.status(200).json({ message: "College name updated successfully", updatedName: user.clgname });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update college email
router.patch('/update-clgemail', authenticate, async (req, res) => {
    try {
        const { newEmail } = req.body;
        const user = req.rootUser;

        if (newEmail) {
            user.clgemail = newEmail;
        }

        await user.save();

        res.status(200).json({ message: "College email updated successfully", updatedEmail: user.clgemail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update college phone
router.patch('/update-clgphone', authenticate, async (req, res) => {
    try {
        const { newPhone } = req.body;
        const user = req.rootUser;

        if (newPhone) {
            user.clgphone = newPhone;
        }

        await user.save();

        res.status(200).json({ message: "College phone updated successfully", updatedPhone: user.clgphone });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update college code
router.patch('/update-clgcode', authenticate, async (req, res) => {
    try {
        const { newCode } = req.body;
        const user = req.rootUser;

        if (newCode) {
            user.clgcode = newCode;
        }

        await user.save();

        res.status(200).json({ message: "College code updated successfully", updatedCode: user.clgcode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update college password
router.patch('/update-clgpassword', authenticate, async (req, res) => {
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
         user.cpassword = newPassword;
        // Save the updated user details
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;