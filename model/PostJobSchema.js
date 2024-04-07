// Import required modules
const mongoose = require('mongoose');
const CLG = require("./clgSchema");

// Define the schema for the Postjob collection
const postjobSchema = new mongoose.Schema({
    instname: {
        type: String,
        required: true
    },
    postavailable: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    jobid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    uniqueid: { // Add clgcode field to store the college code
        type: String,
        required: true
    }
});

// Create a model based on the schema
const Postjob = mongoose.model('Postjob', postjobSchema);

// Export the model
module.exports = Postjob;
