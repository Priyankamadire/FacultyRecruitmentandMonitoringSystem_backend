require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const secretKey = process.env.MYSECRET_KEYS || generateSecretKey();

const clgSchema = new mongoose.Schema({
    clgname:{
        type:String,
        required:true
    },
    clgemail:{
        type:String,
        required:true
    },
    clgphone:{
        type:Number,
        required:true
    },
    clgcode:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                  type:String,
                  required:true
            }
        }
    ]
});

// Hash password before saving
clgSchema.pre('save', async function (next){
    console.log("hi hello");
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});



// Generate auth token
clgSchema.methods.generateAuthToken = async function(){
    try{
       let token = jwt.sign({_id:this._id}, process.env.CLGSECRET_KEY); // Make sure SECRET_KEY is defined in your environment variables
       this.tokens = this.tokens.concat({token:token});
       await this.save();
       return token;
    }  
    catch(err){
          console.log(err);
          throw err; // Make sure to throw the error to handle it in the calling code
    }
};

const Clg = mongoose.model('Clg', clgSchema); // Changed model name to 'User' for convention
module.exports = Clg;
