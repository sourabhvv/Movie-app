const userModel = require("../models/auther")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const autherModel = require("../models/auther");
const articlesModel = require("../models/article");
const playlistModel = require("../models/playlist");
const publicplaylistModel = require("../models/publicplaylist");
const SECRET_KEY = 'Task'




const getPublicPlaylist = async (req, res) => {
  try {
    // Find public playlists where `public` is true
    const publicPlaylists = await publicplaylistModel.find({ public: true });

    if (publicPlaylists.length === 0) {
      return res.status(404).json({ message: "No public playlists found" });
    }

    // Initialize an array to hold all the playlists
    let allUserPlaylists = [];

    // Loop through each public playlist
    for (const publicPlaylist of publicPlaylists) {
      // Find the playlists based on the userId of the public playlist
      const userPlaylists = await playlistModel.find({ userId: publicPlaylist.userId });

      // Add the user playlists to the allUserPlaylists array
      allUserPlaylists = [...allUserPlaylists, ...userPlaylists];
    }

    // If user playlists are found, respond with them
    if (allUserPlaylists.length > 0) {
      res.status(200).json(allUserPlaylists);
    } else {
      res.status(404).json({ message: "No playlists found for the public users" });
    }
  } catch (err) {
    // Handle any errors that occur during the database queries
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = getPublicPlaylist;

const getPlaylist = async (req, res) => {
   

    try {
        // Find the playlist by userId
        let playlist = await playlistModel.find({ userId: req.userId });

        if (playlist) {
            // Append movieId to the existing playlist's movieId array
           
            res.status(200).json(playlist);
        } else {
            // Create a new playlist
           
            res.status(201).json({ message: "Something went wrong" });
        }
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const createPlaylist = async (req, res) => {
    const { title, movieId } = req.body;

    try {
        // Find the playlist by userId
       
            // Create a new playlist
            const newPlaylist = new playlistModel({
                title: title,
                userId: req.userId,
                movieId: movieId,
               
            });

            await newPlaylist.save();
            res.status(200).json({ message: `${title} added tp playlist` });
        }
     catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};


const publicPlaylist = async (req, res) => {
  const {publicValue} = req.body;
  
  try {
    // Find if a playlist already exists for the user
    const existingPlaylist = await publicplaylistModel.findOne({ userId: req.userId });

    if (existingPlaylist) {
      // Update the existing playlist
      existingPlaylist.public = publicValue;
      await existingPlaylist.save();
      res.status(200).json({ message: 'Playlist visibility updated' });
    } else {
      // Create a new playlist
      const publicPlaylist = new publicplaylistModel({
        userId: req.userId,
        public: publicValue,
      });
      await publicPlaylist.save();
      res.status(200).json({ message: 'New playlist created' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};





const getAuthor = async (req, res) =>{
    
    const existingAuther = await autherModel.findOne({ userId: req.userId })
    if(!existingAuther){
        return res.status(404).json({ message: "user not found  " })
    }

    try{
      
        res.status(201).json(existingAuther);
    }catch(err){
        res.status(500).json({ message: "something went wrong " });

    }

}
const getAuthorbyId = async (req, res) => {
    try {
        const existingAuthor = await autherModel.findOne({ _id: req.params.id });
        if (!existingAuthor) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(201).json(existingAuthor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}


const getAllAuthors = async (req, res) => {
    try {
        const authors = await autherModel.find();
        if (!authors || authors.length === 0) {
            return res.status(404).json({ message: "No authors found" });
        }
        res.status(201).json(authors);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}


const createAuthor = async (req,res) =>{
    
  
    const {name,image,description,linkedin} = req.body;
    const newAuther = await autherModel.create(
        {
            name:name,
            userId: req.userId,
            picture:image,
            description:description,
            contact:linkedin,
        }
    );

    try{
        await newAuther.save();
        res.status(201).json(newAuther);
    }catch(err){
        res.status(500).json({ message: "something went wrong " });

    }



}

const updateAuthor = async (req, res) => {
    const { name, image, description, linkedin } = req.body;
    try {
        const existingAuthor = await autherModel.findOneAndUpdate(
            { userId: req.userId },
            { name, picture: image, description, contact: linkedin },
            { new: true }
        );

        if (!existingAuthor) {
            return res.status(404).json({ message: "Author not found" });
        }

        res.status(201).json({ message: "Profile updated" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
}





const createArticles = async (req,res)=>{
    const {articleTitle,description} = req.body;
    const newArticle = await articlesModel.create(
       {
         title:articleTitle,
         description:description,
         userId:req.userId,
       }
    )

    try{
      await newArticle.save()
      res.status(201).json({ message: "article created" });
    }
    catch(err){
        res.status(500).json({ message: "something went wrong " });

    }

}

const getArticles = async (req,res)=>{
    const Articles = await articlesModel.find({ userId: req.userId });
    if(!Articles){
        return res.status(404).json({ message: "no article found" });
    }

    res.status(201).json(Articles);

}

const getArticlesbyID = async (req,res)=>{

    const auther = await autherModel.findOne({ _id: req.params.id });
    const Articles = await articlesModel.find({ userId: auther.userId });
    if(!Articles){
        return res.status(404).json({ message: "no article found" });
    }

    res.status(201).json(Articles);

}

const getallArticles = async (req, res) => {
    try {
        const Articles = await articlesModel.find();
        if (!Articles) {
            return res.status(404).json({ message: "No articles found" });
        }

        const articlesData = await Promise.all(Articles.map(async article => {
            const existingAuthor = await autherModel.findOne({ userId: article.userId });

            return {
                _id: article._id,
                title: article.title,
                description: article.description,
                image: existingAuthor.picture,
                author: existingAuthor.name,
                createdAt: article.createdAt
            };
        }));

        res.status(201).json(articlesData);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}








module.exports = {getPublicPlaylist,publicPlaylist,getPlaylist,createPlaylist,createAuthor, getAuthorbyId,getArticlesbyID,getallArticles,getAuthor,getAllAuthors,createArticles,getArticles,updateAuthor}