const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });
const cors = require('cors');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const authenticate = require('../middleware/authenticate');
const clgauthenticate = require('../middleware/clgauthenticate');
const Apply = require("../model/ApplySchema"); // Import the Apply schema

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

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // File naming convention
    }
});

// Multer file filter for validating file type
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Multer upload instance
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Route for applying to a job with resume upload
// router.post('/apply', authenticate, async (req, res) => {
//     try {
//         const { name,dob,postavailable, qualification, experience, department, jobid, resume } = req.body;

//         // Create a new application entry
//         const newApplication = new Apply({
//             name,
//             dob,
//             postavailable,
//             qualification,
//             experience,
//             department,
//             jobid,
//             resume // Use the resume string directly
//         });

//         // Save the application
//         await newApplication.save();

//         res.status(201).json({ message: 'Application submitted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// router.post('/apply/:id', authenticate, async (req, res) => {
//     try {
//       const jobId = req.params.id;
//       const { name, dob, postavailable, qualification, experience, department, resume } = req.body;
//       // Use jobId and other data to create the application entry
//       // ...
//     } catch (error) {
//       console.error(error);   
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  


// Route for applying to a job with resume upload
// router.post('/apply', upload.single('resume'), async (req, res) => {
//     try {
//         const { postavailable, qualification, experience, department, jobid } = req.body;
//         const resume = req.file.path; // Path to the uploaded resume file

//         // Create a new application entry
//         const newApplication = new Apply({
//             postavailable,
//             qualification,
//             experience,
//             department,
//             jobid,
//             resume
//         });

//         // Save the application
//         await newApplication.save();

//         res.status(201).json({ message: 'Application submitted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
router.post('/apply', authenticate, async (req, res) => {
    try {
        const { name, dob, postavailable, qualification, experience, department, jobid, resume } = req.body;

        // Create a new application entry
        const newApplication = new Apply({
            name,
            dob,
            postavailable,
            qualification,
            experience,
            department,
            jobid,
            resume,
            userid:user.id // Use the resume string directly
        });

        // Save the application
        await newApplication.save();

        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// POST route to apply for a job




router.post('/apply/:id', authenticate, async (req, res) => {
    try {
        const jobId = req.params.id;
        const { name,instname,email, age, postavailable, qualification, experience, department, resume } = req.body;

        // Check if the user has already applied for this job
        const existingApplication = await Apply.findOne({ jobid: jobId, name: name });
        if (existingApplication) {
            // If the user has already applied, return a message indicating so
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        // If the user has not already applied, create a new application entry
        const newApplication = new Apply({
            name,
            instname,
            email,
            age,
            postavailable,
            qualification,
            experience,
            department,
            jobid: jobId,
            resume,
          
        });

        // Save the application
        await newApplication.save();

        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/checkapplication/:id', authenticate,async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id; // Assuming you have user information stored in req.user after authentication

        // Check if there is an application with the given jobId and userId
        const existingApplication = await Apply.findOne({ jobid: jobId, userId: userId });

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

router.get('/applicants/:jobId', clgauthenticate, async (req, res) => {
    try {
      const jobId = req.params.jobId;
  
      // Find all applications for the given job id
      const applications = await Apply.find({ jobid: jobId });
  
      // Send the list of applications as the response
      res.json({ applications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.delete('/applicants/:jobId/:email', clgauthenticate, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const email = req.params.email;

        // Find the application for the given job id and email
        const applicant = await Apply.findOne({ jobid: jobId, email: email });

        // Check if the applicant exists
        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        // Delete the application
        await Apply.deleteOne({ jobid: jobId, email: email });

        // Return success message
        res.status(200).json({ message: 'Applicant deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/applicants/:jobId/:email', clgauthenticate, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const email = req.params.email;

        // Find all applications for the given job id and email
        const applications = await Apply.find({ jobid: jobId, email: email });

        // Send the list of applications as the response
        res.json({ applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

