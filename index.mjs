import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import dotenv from "dotenv"
import userRouter from "./routes/user.mjs"
import authRouter from "./routes/auth.mjs"
import postRouter from "./routes/post.mjs"
import conversation from "./routes/conversation.mjs"
import messages from "./routes/messages.mjs"
import multer from "multer"
import path from "path"

import { fileURLToPath } from 'url';
//////path
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename)
const uploadPath = path.join(__dirname, "/public/images")
///////
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use("/images", express.static(uploadPath))
app.use(morgan("common"))
app.use(helmet())
app.use("/user", userRouter)
app.use("/conversations",conversation)
app.use("/messages",messages)
app.use(authRouter)
app.use("/post", postRouter)
const PORT = process.env.PORT || 5001
mongoose.connect(process.env.MONGO_URL, () => console.log("connected to Mongo"))
////////////upload files

let name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

app.post("/post-img", upload.single("file"), (req, res) => {

  try {

    return res.send("uploaded sucessfully")
  }
  catch (e) {
    console.log(e);
  }
})

//////////////////////////
app.get("/", (req, res) => {

  console.log(uploadPath);
  res.status(200).send("hello")
})

app.listen(PORT, () => console.log("Server listening on port " + PORT))