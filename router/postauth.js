const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const cors = require('cors');
const cookieParser = require('cookie-parser');
const clgauthenticate = require('../middleware/clgpostauth'); // Importing the authentication middleware
const Postjob = require("../model/PostJobSchema");
const Notification = require("../model/NotifiSchema"); // Import Clg model

const Clg = require("../model/clgSchema"); // Import Clg model
const middleware = require("../middleware/authenticate");
const authenticate = require('../middleware/clgauthenticate');
router.use(cookieParser());
// router.use(cors({
//     origin: 'https://faculty-recruitmentand-monitoring-system-frontend.vercel.app',
//     credentials: true
// }));
// router.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));
const corsOptions = {
    origin: true, // Allow requests from any origin
    credentials: true, // Allow credentials to be included in requests
  };
// router.use(cors());
router.use(cors(corsOptions));
router.post("/postingjob", clgauthenticate, async (req, res) => {
    try {
        const {  postavailable, qualification, experience, department, jobid, date } = req.body;

        // Check if all required fields are provided
        if (!postavailable || !qualification || !experience || !department || !jobid || !date) {
            return res.status(400).json({ error: "Please fill in all the details" });
        }

        // Find the college based on the user ID
        const college = await Clg.findOne({ _id: req.userID });

        // Check if the college exists
        if (!college) {
            return res.status(404).json({ error: "College not found" });
        }

        // Check if the jobid already exists
        const existingPost = await Postjob.findOne({ jobid });

        // If the jobid already exists, return an error
        if (existingPost) {
            return res.status(400).json({ error: "Job ID already exists" });
        }

        // Create a new job post with the college's unique ID
        const newPost = new Postjob({ 
            instname:college.clgname,
            postavailable,
            qualification,
            experience,
            department,
            jobid,
            date,
            uniqueid: college._id // Use the college's _id as uniqueid
        });

        // Save the job post
        await newPost.save();

        // Return success message
        res.status(201).json({ message: "Job posted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.delete("/delete-job/:jobId", clgauthenticate, async (req, res) => {
    try {
        const jobId = req.params.id;

        // Find the job post by its ID
        const jobPost = await Postjob.findOne(jobId);

        // Check if the job post exists
        if (!jobPost) {
            return res.status(404).json({ error: "Job not found" });
        }

        // // Check if the user deleting the job is authorized (e.g., if the job belongs to the college)
        // if (jobPost.uniqueid.toString() !== req.userID) {
        //     return res.status(403).json({ error: "Unauthorized to delete this job" });
        // }

        // Delete the job post
        // await jobPost.remove();
        await Postjob.deleteOne(jobId);
        // Return success message
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/postingjob/:id", clgauthenticate, async (req, res) => {
    try {
        const uniqueId = req.params.id;
        const { postavailable, qualification, experience, department, jobid, date } = req.body;

        // Check if all required fields are provided
        if (!postavailable || !qualification || !experience || !department || !jobid || !date) {
            return res.status(400).json({ error: "Please fill in all the details" });
        }
        const JobExists = await Postjob.findOne({ jobid: jobid, uniqueId: uniqueId });

        // Create a new job post with the college's unique ID
        const newPost = new Postjob({
            instname: req.clgname, // Use the college's name from the authenticated request
            postavailable,
            qualification,
            experience,
            department,
            jobid,
            date,
            uniqueid: uniqueId // Use the college's ID from the request parameters
        });

        // Save the job post
        await newPost.save();

        // Return success message
        res.status(201).json({ message: "Job posted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// router.post("/postingjob", clgauthenticate, async (req, res) => {
//     try {
//         const { instname, postavailable, qualification, experience, department, jobid, date ,uniqueid } = req.body;

//         // Check if all required fields are provided
//         if (!instname || !postavailable || !qualification || !experience || !department || !jobid || !date ||!uniqueid) {
//             return res.status(400).json({ error: "Please fill in all the details" });
//         }

//         // Find the college based on the user ID
//         const college = await Clg.findOne({ _id: req.userID });

//         // Check if the college exists
//         if (!college) {
//             return res.status(404).json({ error: "College not found" });
//         }

//         // Create a new job post
//         const newPost = new Postjob({ instname, postavailable, qualification, experience, department, jobid, date,uniqueid});

//         // Save the job post
//         await newPost.save();

//         // Return success message
//         res.status(201).json({ message: "Job posted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// Assuming you have a route for job seeker authentication and it sets the user ID in req.userID

// Create a new route to fetch all job posts
router.get("/jobs",middleware, async (req, res) => {
    try {
        // Retrieve all job posts from the database
        const allJobs = await Postjob.find();

        // Check if there are any job posts
        if (!allJobs || allJobs.length === 0) {
            return res.status(404).json({ message: "No jobs found" });
        }

        // Return the list of job posts
        res.status(200).json({ jobs: allJobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/jobs/:id", middleware, async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Postjob.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get("/clgjobs/:id", clgauthenticate, async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Postjob.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Assuming you have imported necessary dependencies and set up your Express app
router.get("/clgjobs",clgauthenticate, async (req, res) => {
    try {
        // Retrieve all job posts from the database
        const allJobs = await Postjob.find();

        // Check if there are any job posts
        if (!allJobs || allJobs.length === 0) {
            return res.status(404).json({ message: "No jobs found" });
        }

        // Return the list of job posts
        res.status(200).json({ jobs: allJobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Define a route handler for GET requests to '/clgjobs'
router.get('/clgs/clgjobs/:instname', clgauthenticate, async (req, res) => {
    try {
        // Extract college name from the request parameter
        const instname = req.params.instname;
        const jobs = await Postjob.find({ instname });

        // Return the fetched jobs as a JSON response
        res.json({ jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('checkapplication/:id', clgauthenticate,async (req, res) => {
    try {
        const uniqueId = req.params.id;
        const userId = req.user.id; // Assuming you have user information stored in req.user after authentication

        // Check if there is an application with the given jobId and userId
        const existingApplication = await Postjob.findOne({ uniqueid:uniqueId,  userId: userId });

        if (existingApplication) {
            res.json({ applied: true });
        } else {
            res.json({ applied: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/clgs/clgjobs/:uniqueid', clgauthenticate, async (req, res) => {
    try {
        const uniqueid = req.params.uniqueid;

        // Fetch jobs posted by the college with the given unique ID
        const jobs = await Postjob.find({ uniqueid });

        // Return the fetched jobs as a JSON response
        res.json({ jobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});








module.exports = router;
