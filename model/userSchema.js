require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to generate a random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Secret key for JWT signing, using environment variable or generating a new key
const secretKey = process.env.SECRET_KEY || generateSecretKey();

// Define user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of email addresses
    },
    phone: {
        type: Number, // Changed type to String to support all phone number formats
        required: true
    },
    qualification:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true,
         // Minimum length for password
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Middleware to hash passwords before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            // Hash the password
            this.password = await bcrypt.hash(this.password, 12);
            // Hash the confirm password
            this.cpassword = await bcrypt.hash(this.cpassword, 12);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Method to generate authentication token
userSchema.methods.generateAuthToken = async function() {
    try {
        // Sign a JWT token containing the user's ID (_id) using the secret key
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);

        // Concatenate the generated token to the user's tokens array
        this.tokens = this.tokens.concat({ token });

        // Save the user object with the updated tokens array
        await this.save();

        // Return the generated token
        return token;
    } catch (err) {
        // If an error occurs during token generation or saving, log the error and throw an error
        console.error(err);
        throw new Error('Error generating auth token');
    }
};

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
