const router = require("express").Router();
const postModel = require("../models/postModel");
const UserModel = require("../models/UserModel");

// create post
router.post('/',async (req,res) => {
    const newPost = new postModel(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(error) {
        res.status(403).json(error.message);
    }
})

// update post
router.put('/:postId', async (req,res) => {
    try {
        const post = await postModel.findById(req.params.postId);
        if(post.userId === req.body.userId) {
            const newPost = await postModel.findByIdAndUpdate(req.params.postId,{$set: req.body});
            res.status(200).json("post has been updated.");
        }else {
            res.status(403).json("you can only update your post.");
        }
    }catch(error) {
        res.status(500).json(error.message);
    }
})

// delete post
router.delete('/:postId', async (req,res) => {
    try {
        const post = await postModel.findById(req.params.postId);
        if(post.userId === req.body.userId) {
            await postModel.findByIdAndDelete(req.params.postId);
            res.status(200).json("post has been deleted.");
        }else {
            res.status(403).json("you can only delete your post.");
        }
    }catch(error) {
        res.status(500).json(error.message);
    }
})

 // like-unlike post
 router.put('/:postId/like', async (req,res) => {
    try {
        const post = await postModel.findById(req.params.postId);
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("The post has been liked successfully.");
        }else {
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json("The post has been unliked successfully.");
        }
    }catch(error) {
        res.status(500).json(error.message);
    }
 })

 // get a post
 router.get('/:postId', async (req,res) => {
    try {
        const post = await postModel.findById(req.params.postId);
        res.status(200).json(post);
    }catch(error) {
        res.status(500).json(error.message);
    }
 })

 // get timeline posts
 router.get('/timeline/:userId', async (req,res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const userPosts = await postModel.find({userId: user._id});
        const friendPosts = await Promise.all(
            user.followings.map((friendId) => {
                return postModel.find({userId: friendId});
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    }catch(error) {
        res.status(500).json(error);
    }
 })

 // get users posts
 router.get('/profile/:username', async (req,res) => {
    try {
        const user = await UserModel.findOne({username : req.params.username});
        const userPosts = await postModel.find({userId: user._id});
        res.status(200).json(userPosts);
    }catch(error) {
        res.status(500).json(error);
    }
 })

module.exports = router;