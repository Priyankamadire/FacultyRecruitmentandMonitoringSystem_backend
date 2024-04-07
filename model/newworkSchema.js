const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { files } = require('lite-server/lib/config-defaults');
const newworSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   
    workingpost:{
        type:String,
        required:true
    },
    newinstituteid:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
       
    year:{
        type:String,
        required:true
    },
    
    phone:{
        type:Number,
        required:true
    }, email:{
        type:String,
        required:true
    },
    collegeId:{
        type:String,
        required:true
    }
});





const New = mongoose.model('NEW',newworSchema);
module.exports =  New;
