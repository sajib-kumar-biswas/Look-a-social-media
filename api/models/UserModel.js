const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 5,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        min: 6,
        require: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers : {
        type: Array,
        default: []
    },
    followings : {
        type: Array,
        default: []
    },
    reqReceived: {
        type: Array,
        default:[]
    },
    isAdmin : {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        default: "Hello my friends!",
        max: 50
    },
    city : {
        type: String,
        default: "New York",
        max: 50
    },
    from : {
        type: String,
        default: "Dhaka",
        max: 50
    },
    relationship: {
        type: Number,
        enum: [1,2,3]
    },
    work: {
        type: String,
        default: "Programmer",
        max: 50
    },
    gender: {
        type: String,
        default: "male",
        max: 10
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("UserModel", userSchema);