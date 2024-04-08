const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/clgauthenticate");
const cors = require('cors');
const Apply = require("../model/ApplySchema");
const cookieParser = require('cookie-parser');
const Notification = require("../model/NotifiSchema");
const middleware = require("../middleware/authenticate")
router.use(cookieParser());
router.use(cors({
    origin: 'https://faculty-recruitmentand-monitoring-system-frontend.vercel.app',
    credentials: true 
}));

router.post('/notifications/:jobid', authenticate, async (req, res) => {
    try {
        const { email, message, status } = req.body;
        const jobid = req.params.jobid;

        // Check if the jobid exists in the Apply collection
        const job = await Apply.findOne({ _id: jobid });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const notification = new Notification({
            email: email,
            message: message,
            status: status,
            jobid: jobid,
            createdAt: new Date()
        });

        await notification.save();

        res.status(201).json({ message: 'Notification created successfully' });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/hire/:email/:jobid', authenticate, async (req, res) => {
    try {
        const email = req.params.email;
        const jobid = req.params.jobid;
        
        // Find and update the applicant status
        const applicant = await Apply.findOneAndUpdate({ email: email, jobid: jobid }, { status: 'hire' });

        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        const instname = applicant.instname;
        const postavai = applicant.postavailable;
        const message = `Congratulations! Your application has been accepted by ${instname} for ${postavai} lecturer Check your email for Interview Details`;
        await sendNotification(email, message, jobid, 'hire');

        res.status(200).json({ message: 'Applicant hired successfully' });
    } catch (error) {
        console.error('Error hiring applicant:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/reject/:email/:jobid', authenticate, async (req, res) => {
    try {
        const email = req.params.email;
        const jobid = req.params.jobid;
        
        // Find and delete the applicant
        const deletedApplicant = await Apply.findOneAndDelete({ email: email, jobid: jobid });

        if (!deletedApplicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        const instname = deletedApplicant.instname;
        const postavai = deletedApplicant.postavailable;
        const message = `We regret to inform you that your application has been rejected by ${instname} for ${postavai} lecturer`;
        await sendNotification(email, message, jobid, 'reject');

        res.status(200).json({ message: 'Applicant rejected successfully' });
    } catch (error) {
        console.error('Error rejecting applicant:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// router.post('/reject/:email/:jobid', authenticate, async (req, res) => {
//     try {
//         const email = req.params.email;
//         const jobid = req.params.jobid;
        

//         const applicant = await Apply.findOne({ email: email, jobid: jobid });
       
//          const instname = applicant.instname;
//          const postavai = applicant.postavailable;
//         if (!applicant) {
//             return res.status(404).json({ error: 'Applicant not found' });
//         }

//         const message = 'We regret to inform you that your application has been rejected.';
//         await sendNotification(email, message, jobid, 'reject');

//         res.status(200).json({ message: 'Applicant rejected successfully' });
//     } catch (error) {
//         console.error('Error rejecting applicant:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.get('/mynotification', authenticate, async (req, res) => {
    try {
        // Retrieve all job posts from the database
        const allJobs = await Notification.find();

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
router.get('/mynotification/:jobid', authenticate, async (req, res) => {
    try {
        const jobid = req.params.jobid;

        // Retrieve notifications for the specified jobid from the database
        const notifications = await Notification.find({ jobid: jobid });

        // Check if there are any notifications
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for the specified jobid" });
        }

        // Return the list of notifications
        res.status(200).json({ notifications: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/mynotification/:email/:jobid', authenticate, async (req, res) => {
    try {
        const { email, jobid } = req.params;

        // Retrieve notifications for the specified email and jobid from the database
        const notifications = await Notification.find({ email: email, jobid: jobid });

        // Check if there are any notifications
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for the specified email and jobid" });
        }

        // Return the list of notifications
        res.status(200).json({ notifications: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/myynotification/:email/:jobid', middleware, async (req, res) => {
    try {
        const { email, jobid } = req.params;

        // Retrieve notifications for the specified email and jobid from the database
        const notifications = await Notification.find({ email: email, jobid: jobid });

        // Check if there are any notifications
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for the specified email and jobid" });
        }

        // Return the list of notifications
        res.status(200).json({ notifications: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/myenotification/:email', authenticate, async (req, res) => {
    try {
        const { email } = req.params;

        // Retrieve notifications for the specified email from the database
        const notifications = await Notification.find({ email: email });

        // Check if there are any notifications
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for the specified email" });
        }

        // Return the list of notifications
        res.status(200).json({ notifications: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get('/myennotification/:email', middleware, async (req, res) => {
    try {
        const { email } = req.params;

        // Retrieve notifications for the specified email from the database
        const notifications = await Notification.find({ email: email });

        // Check if there are any notifications
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for the specified email" });
        }

        // Return the list of notifications
        res.status(200).json({ notifications: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
async function sendNotification(email, message, jobid, status) {
    try {
        console.log(`Sending notification to ${email} for jobid ${jobid}: ${message}`);

        const notification = new Notification({
            email: email,
            message: message,
            status: status,
            jobid: jobid,
            createdAt: new Date()
        });

        await notification.save();
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
}

module.exports = router;
