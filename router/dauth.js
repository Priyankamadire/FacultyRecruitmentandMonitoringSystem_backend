const express = require('express');
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const clgauthenticate = require('../middleware/clgauthenticate'); // Importing the authentication middleware

const Detail = require("../model/detailSchema");

router.use(cookieParser());
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

router.post('/wfaculty', async (req, res) => {
    try {
        const { name, workingpost, instituteid, qualification, department, year, phone, email } = req.body;

        // Check if all required fields are provided
        if (!name || !workingpost || !instituteid || !qualification || !department || !year || !phone || !email) {
            return res.status(400).json({ error: "Please fill in all the details" });
        }

        // Check if a faculty with the same institute ID already exists
        const facExists = await Detail.findOne({ instituteid: instituteid });
        if (facExists) {
            return res.status(409).json({ error: "Faculty with the same institute ID already exists" });
        }

        // Create a new faculty detail document
        const detail = new Detail({ name, workingpost, instituteid, qualification, department, year, phone, email });
        await detail.save();

        res.status(201).json({ message: "Faculty details saved successfully" });
    } catch (error) {
        console.error("Error saving faculty details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post('/wfaculty/:id',clgauthenticate, async (req, res) => {
    try {
        const collegeId = req.params.id; // Extracting the college ID from the route parameters
        const { name, workingpost, instituteid, qualification, department, year, phone, email } = req.body;

        // Check if all required fields are provided
        if (!name || !workingpost || !instituteid || !qualification || !department || !year || !phone || !email) {
            return res.status(400).json({ error: "Please fill in all the details" });
        }

        // Check if a faculty with the same institute ID already exists within the specified college
        const facExists = await Detail.findOne({ instituteid: instituteid, collegeId: collegeId });
        if (facExists) {
            return res.status(409).json({ error: "Faculty with the same institute ID already exists within the college" });
        }

        // Create a new faculty detail document
        const detail = new Detail({ name, workingpost, instituteid, qualification, department, year, phone, email, collegeId: collegeId });
        await detail.save();

        res.status(201).json({ message: "Faculty details saved successfully" });
    } catch (error) {
        console.error("Error saving faculty details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/wofaculty/:collegeId', async (req, res) => {
    try {
        const collegeId = req.params.collegeId; // Extracting the college ID from the route parameters

        // Find all faculty details associated with the specified college ID
        const facultyDetails = await Detail.find({ collegeId: collegeId });

        res.status(200).json({ facultyDetails: facultyDetails });
    } catch (error) {
        console.error("Error fetching faculty details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
