const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer  = require('multer');
const path = require("path");
// const bodyParser=require('body-parser');


// express application
const app = express();



//  /api/user routes handler
const userRoute = require('./routes/users.js');
const authRoute = require('./routes/auth.js');
const postRoute = require('./routes/posts'); 
const conversationRoute = require("./routes/conversation.js");
const messageRoute = require("./routes/message.js");
const commentRoute = require("./routes/comment.js");

// adding .env info to procees.env
dotenv.config();

// mongoose.connect(process.env.MONGO_URL)
//     .then(()=> (console.log("Connected to MongoDB")),(err) => (console.log(err.message)));

 // connecting to mongoDB
const main = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.log(error.message);
        }
}

main();

const PORT = 5000;

app.use('/images', express.static(path.join(__dirname , "public/images")));

// middlewares
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
// app.use(upload.array());
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.log(error);
  } 
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/comments", commentRoute);

app.listen(PORT,()=>{
    console.log(`listening to the port ${PORT}`);
})