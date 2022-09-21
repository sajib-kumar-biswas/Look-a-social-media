const router = require("express").Router();
const Conversation = require("../models/Conversation");

// start a new conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get an user's conversation
router.get("/:userId", async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        })
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get a conversation which include two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        let conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] }
        })
        if (!conversation) {
            const newConversation = new Conversation({
                members: [req.params.firstUserId, req.params.secondUserId]
            })

            try {
                const conversation = await newConversation.save();
                res.status(200).json(conversation);
            } catch (error) {
                res.status(500).json(error);
            }
        }else {
            res.status(200).json(conversation);
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;