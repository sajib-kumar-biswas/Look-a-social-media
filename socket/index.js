const io = require("socket.io")(4000, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = [];
let users2 = [];

const addUser = (userId,socketId) => {
    !users.some(user => user.userId === userId) && 
        users.push({userId, socketId});
}

const add2User = (userId, socketId) => {
    !users2.some(user => user.userId === userId) && 
        users2.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId!==socketId);
}

const remove2User = (socketId) => {
    users2 = users2.filter(user => user.socketId!==socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

const get2User = (userId) => {
    return users2.find(user => user.userId === userId);
}

io.on("connection", (socket) => {
    console.log("a user connected.");
    // take userId and socketId from a user and refresh active users 
    socket.on("addUser", userId => {
        addUser(userId,socket.id);
        io.emit("getUsers", users);
    })

    // add2 user for handling friend requests
    socket.on("add2User", userId => {
        add2User(userId, socket.id);
    })

    // send and get message
    socket.on("sendMessage", ({senderId,receiverId,text})=>{
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage",{
            senderId,
            text
        })
    })

    // cancel request
    socket.on("cancelRequest", ({senderId, receiverId}) => {
        const user = get2User(receiverId);
        io.to(user.socketId).emit("cancelledRequest", {
            senderId
        })
    })

    // get request from an user
    socket.on("sendRequest", ({senderId, receiverId})=> {
        const user = get2User(receiverId);
        io.to(user.socketId).emit("getRequest", {
            senderId
        })
    })

    // your sended request got accepted
    socket.on("sendRequestAccepted", ({senderId, receiverId})=> {
        const user = get2User(receiverId);
        io.to(user.socketId).emit("getRequestAccepted", {
            senderId
        })
    })

    socket.on("disconnect", ()=>{
        console.log("a user disconnected!");
        removeUser(socket.id);
        remove2User(socket.id);
        // remove a user and refresh active users list
        io.emit("getUsers", users);
    })
})