const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { files } = require('lite-server/lib/config-defaults');

const retaireSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    workedpost:{
        type:String,
        required:true
    },
    instituteid:{
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
    
    retairedyear:{
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





const Retaire = mongoose.model('RETAIRE',retaireSchema);
module.exports =  Retaire;
