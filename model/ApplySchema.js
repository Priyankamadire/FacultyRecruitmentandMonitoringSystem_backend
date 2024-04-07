const mongoose = require('mongoose');

const applySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    instname:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
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
    resume: {
        type: String,
        required: true
    }
});

const Apply = mongoose.model('Apply', applySchema);
module.exports = Apply;
