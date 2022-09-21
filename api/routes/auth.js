const router = require("express").Router();
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

// register user
router.post('/register', async (req,res) => {
    try {
            // generate hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
            // create new user
        const newUser = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
            // save user and return response
        await newUser.save();
        res.status(200).json(newUser); 
    }catch(error) {
        res.status(500).json(error);
    }
})

// user login
router.post('/login', async (req,res) => {
    try {
            // find user from database
        const user = await UserModel.findOne({email: req.body.email});
            // check its validity
        !user && res.status(404).send("user not found.");
            // compare both password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send("wrong password");
        res.status(200).json(user);
    }catch(error) {
        res.status(500).json(error);
    }
})

module.exports = router;