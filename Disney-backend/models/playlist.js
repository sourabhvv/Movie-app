const mongoose = require('mongoose');
const playlistSchema = new mongoose.Schema({
            title:{
                type:String,
                required:true
            },
            movieId:{
                 type:String,
                 required:true  
            },
           
            userId:{
                type:String,
                required:true
            }

        },{timestamps:true});
    
    module.exports =  mongoose.model('playlist',playlistSchema);