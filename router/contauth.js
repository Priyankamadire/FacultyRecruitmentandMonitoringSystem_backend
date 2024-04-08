const express = require('express');
const router = express.Router();
const Contact = require('../model/ContactSchema');
const authenticate = require('../middleware/authenticate')
const clgauthenticate = require('../middleware/clgauthenticate')
const cors = require('cors');
const Postjob = require("../model/PostJobSchema");
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({
    origin: 'https://faculty-recruitment-and-monitoring-system-frontend-anbfs3l70.vercel.app',
    credentials: true 
}));

router.post('/contacts', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Create a new contact instance
        const newContact = new Contact({
            name,
            email,
            message
        });
        // Save the new contact to the database
        await newContact.save();
        res.status(201).json({ message: 'Contact created successfully' });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Failed to create contact' });
    }
});



router.post('/clgcontacts', async (req, res) => {
    try {
        const { clgname, clgemail, message } = req.body;
        // Create a new contact instance
        const newContact = new Contact({
            clgname,
            clgemail,
            message
        });
        // Save the new contact to the database
        await newContact.save();
        res.status(201).json({ message: 'Contact created successfully' });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Failed to create contact' });
    }
});

module.exports = router;
