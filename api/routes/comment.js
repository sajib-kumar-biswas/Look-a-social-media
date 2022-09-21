const router = require("express").Router();
const Comment = require("../models/Comment");
const UserModel = require("../models/UserModel");

// add a comment to a post
router.post("/", async (req,res) => {
    const newComment =  new Comment(req.body);
    try {   
        const savedComment = await newComment.save();
        const sender = await UserModel.findById(req.body.sender);
        const ret = {
            picture: sender.profilePicture,
            text: savedComment.text
        }
        res.status(200).json(ret);
    }catch(error) {
        res.status(500).json(error);
    }
})

// get all comments of specified postId
router.get("/:postId", async (req,res) => {
    try {
        const comments = await Comment.find({
            postId: req.params.postId
        })
        // comments.map(com => )
        let ret = [];
        Promise.all(comments.map(async (com) => {
            const sender = await UserModel.findById(com.sender);
            ret.push({picture: sender.profilePicture, text: com.text});
        })).then(()=>{
            res.status(200).json(ret);  
        })
    }catch(error) {
        res.status(500).json(error);
    }
})

module.exports = router;