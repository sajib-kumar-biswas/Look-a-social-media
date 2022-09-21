const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");

// get all the users
router.get("/all", async (req,res) => {
    try {
        const users = await UserModel.find({});
        const retUsers = [];
        users.forEach(u => {
            const{username,profilePicture,_id,...other} = u;
            retUsers.push({username, profilePicture,_id});
        })
        res.status(200).json(retUsers);
    }catch(error) {
        res.status(500).json(error);
    }
})

// update user profile
router.put("/:id", async (req,res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        const salt = await bcrypt.genSalt(10);
        const match = await bcrypt.compare(req.body.oldPassword,user.password);
        if(!match){
            return res.status(200).json("Old password does not match.");
        }
        req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);
        req.body = {...req.body, password: req.body.newPassword};
        delete req.body.oldPassword;
        delete req.body.newPassword;
        const retUser = await UserModel.findByIdAndUpdate(req.params.id, {$set: req.body});

        res.status(200).json("You successfully updated your profile.");
    }catch(error) {
        res.status(500).json("You can only update your account.");
    }
})

// update user
// router.put('/:id', async (req,res) => {
//     if(req.body.userId === req.params.id || req.body.isAdmin) {
//         if(req.body.password) {
//             try {
//                 const salt = await bcrypt.genSalt(10);
//                 req.body.password = await bcrypt.hash(req.body.password, salt);
//             } catch(error) {
//                 return res.status(500).json("some problem with password.");  
//             }
//         }

//         try {
//             const user = await UserModel.findByIdAndUpdate(req.params.id, {$set: req.body});
//             res.status(200).json("Account has been updated.");
//         } catch (error) {
//             return res.status(500).json(error);
//         }
//     }else {
//         return res.status(403).json("You can update only your account!");
//     }
// })

// delete user
router.delete('/:id', async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted.");
        } catch (error) {
            return res.status(500).json(error);
        }
    }else {
        return res.status(403).json("You can delete only your account!");
    }
})

// get user using query
// localhost:5000/api/users?userId=8789739841723
// localhost:5000/api/users?username=sajib
router.get('/', async (req,res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId 
        ? await UserModel.findById(userId) 
        : await UserModel.findOne({username: username});

        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get an users friends
router.get("/friends/:userId", async (req,res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return UserModel.findById(friendId);
            })
        )
        let friendsList = [];
        friends.map((friend) => {
            const {_id,username,profilePicture} = friend;
            friendsList.push({_id,username,profilePicture});
        })
        res.status(200).json(friendsList);
    } catch(error) {
        res.status(500).json(error);
    }
})


// follow user
router.put('/:id/follow', async (req,res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await UserModel.findById(req.params.id);
            const currentUser = await UserModel.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId}});
                await user.updateOne({$push: {followings: req.body.userId}});
                await currentUser.updateOne({$push: {followings: req.params.id}});
                res.status(200).json("user has been followed");
            }else {
                res.status(403).json("You already follow this user.");
            }
        }catch(error) {
            res.status(403).json(error.message);
        }
    } else {
        res.status(403).json("you can't follow yourself.");
    }
})

// unfollow user
router.put('/:id/unfollow', async (req,res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await UserModel.findById(req.params.id);
            const currentUser = await UserModel.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId}});
                await user.updateOne({$pull: {followings: req.body.userId}});
                await currentUser.updateOne({$pull: {followings: req.params.id}});
                res.status(200).json("user has been unfollowed");
            }else {
                res.status(403).json("You don't follow this user.");
            }
        }catch(error) {
            res.status(403).json(error.message);
        }
    } else {
        res.status(403).json("you can't unfollow yourself.");
    }
})

module.exports = router;