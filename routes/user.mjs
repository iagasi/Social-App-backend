import express from "express";
import bcrypt from "bcrypt"
import User from "../models/User.mjs"
import { fileURLToPath } from 'url';
import multer from "multer"
import path from "path"
import { log, profile } from "console";
//////path
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename)
const uploadPath = path.join(__dirname, "..", "/public/images/users")
/////////
const router = express.Router()


router.get("/all", async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    }
    catch (e) {
        res.status(500).send(e)
    }


}
)


router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(id)
        console.log(user);
       // const { password, updatedAt, ...other } = user._doc
        res.status(200).json(user)
    }
    catch (e) {
        res.status(500).send("internal server error")
    }
})



router.put("/", async (req, res) => {
    const { id } = req.body
    if (id) {

        if (req.body.password) {

            req.body.password = await bcrypt.hash(req.body.password, 10)
            const user = await User.findByIdAndUpdate({ _id: id }, { $set: req.body })
            res.send("Modified user")
        }
    }

    else {
        return res.status(403).json("You can update only your accaunt ")
    }
})

router.put("/follow/:fid", async (req, res) => {
    const { id } = req.body
    const { fid } = req.params

    if (id && fid) {
        try {
            const user = await User.findById(id)
            const follower = await User.findById(fid)

            if (!user.followers.includes(fid)) {
                await User.findByIdAndUpdate(follower._id, { $push: { followers: id } })
                await User.findByIdAndUpdate(user._id, { $push: { followers: fid } })
                console.log("followed sucessfully");
                res.status(200).json("Followed sucessfully")
            }
            else {

                res.status(403).json("You already follow this user")
            }
        }
        catch (e) {

        }
    }
})
router.put("/unfollow/:fid", async (req, res) => {
    const { id } = req.body
    const { fid } = req.params
    console.log(id, fid);
    if (id && fid) {
        try {

            const user = await User.findById(id)
            const follower = await User.findById(fid)

            if (user.followers.includes(fid)) {

                await User.findByIdAndUpdate(user._id, { $pull: { followers: fid, } })
                await User.findByIdAndUpdate(follower._id, { $pull: { followers: id } })
                res.status(200).json("Unfollowed sucessfully")
                console.log("Unfollowed");
            }
            else {
                res.status(403).json("You already unfollowed")
            }
        }
        catch (e) {

        }
    }
})

router.delete("/", async (req, res) => {
    const { id } = req.body
    if (id || req.body.isAdmin) {
        try {
            const deleted = await User.deleteOne({ _id: id })
            console.log(deleted);
            res.send("Sucessfully deleted")
        }
        catch (e) {
            res.send("Cannot delete user")
        }
    }
    else {
        res.send("yo can delete only your accaunt")
    }
})



//////////////////geting My friends list

router.get("/friends/:userId", async (req, res) => {
    const { userId } = req.params
    try {
        const user = await User.findById(userId)
        const friends = await Promise.all(
            user.followers.map(friendId => User.findById(friendId))
        )

        res.status(200).send(friends)
    }
    catch (e) {
        res.status(500).json(e)
    }
})
/////upload file

const storag = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storag })


router.post("/user-img", upload.single("file"), async(req, res) => {
console.log(req.file);
    try {
       const user=await User.findByIdAndUpdate(req.body.userId,{profilePicture:"/images/users/"+req.file.filename})
  
    }
    catch (e) {
console.log(e);
    }
    res.send("uploaded")
})

export default router