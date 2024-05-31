const mongoose = require('mongoose');
const publicplaylist = new mongoose.Schema({
           
            public:{
                type:String,
                required:true
            },
            userId:{
                type:String,
                required:true
            }

        },{timestamps:true});
    
    module.exports =  mongoose.model('publicplaylist',publicplaylist);