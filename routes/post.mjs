import express from "express";
import bcrypt from "bcrypt"
import User from "../models/User.mjs"
import Post from "../models/Post.mjs";
import fs from "fs"
import path from "path"
import { __dirname } from "../index.mjs";


const router = express.Router()


router.get("/:postId", async (req, res) => {
    const { postId } = req.params
    const posts = await Post.findById(postId)
    res.send(posts)

})


router.post("/", async (req, res) => {

    try {
        const post = new Post({ ...req.body })
        post.save()
        res.status(200).send("saved")
    }
    catch (e) {
        res.status(500).send(e)
    }
})


router.put("/:requesterId", async (req, res) => {
    const { userId } = req.body
    const { requesterId } = req.params
    if (userId == requesterId) {
        const post = await Post.findOneAndUpdate({ userId: userId }, { $set: req.body })

        if (post) {
            res.send("Post updated")
        }
    }

    else {
        res.status(403).send("you can update only your post")
    }


})

router.post("/delete", async (req, res) => {
    const { userId, postId } = req.body


    try {

        const p = await Post.findById(postId)
        if (p.userId == userId) {
            if (p.img) {
                const pathToImg = path.join(__dirname, "public/images", p.img)
                const exists = fs.existsSync(pathToImg)
                if (exists) {
                    fs.unlinkSync(pathToImg)
                }
            }


            const post = await Post.findByIdAndDelete(postId)

            post ? res.send("Post deleed") : res.status(500).send("server error")

        }

        else {
            res.status(403).send("y can  only DELETE   Your post")
        }
    }
    catch (e) {
        console.log(e);
    }

}
)





/////like wthe post
router.put("/:postId/like", async (req, res) => {

    const { postId } = req.params
    const { userId } = req.body
    try {
        const post = await Post.findById(postId)
        if (!post.likes.includes(userId)) {
            // post.likes.push(userId)
            // post.save()
            await post.updateOne({ $push: { likes: userId } })

            res.send(post);
        }
        else {
            const post = await Post.findById(postId)
            if (post.likes.includes(userId)) {
                // post.likes.push(userId)
                // post.save()
                await post.updateOne({ $pull: { likes: userId } })
                await post.save()
                res.send(post);
            }
        }
    }
    catch (e) { res.json(e) }
})


/////Dislike wthe post
router.put("/:postId/dislike", async (req, res) => {

    const { postId } = req.params
    const { userId } = req.body
    try {
        const post = await Post.findById(postId)
        if (post.likes.includes(userId)) {
            // post.likes.push(userId)
            // post.save()
            await post.updateOne({ $pull: { likes: userId } })
            await post.save()
            res.send(("suceeeded"));
        }
        else {
            res.send("You already DISLIKED this post")
        }
    }
    catch (e) { res.json(e) }
})

//get timeline posts
router.post("/timeline", async (req, res) => {
    try {


        const { userId } = req.body
        let postsArray = []
     

        if (!userId) { return res.send("User not Logged") }
        const currentUser = await User.findById(userId)


        const userPosts = await Post.find({ userId: currentUser._id })
        let posts
        let postOwner = []
        if (currentUser.followers.length >= 0) {
            for await (const iterator of currentUser.followers) {

                posts = await Post.find({ userId: iterator })


            }
            postsArray.push(...posts)

            if (!posts) { res.send([]); return }
            for await (const iterator of posts) {
                postOwner.push(await User.findById(iterator.userId))
            }

        }

        postsArray.push(...userPosts)




        res.json({ postsArray, postOwner })
    }
    catch (e) {
        console.log(e);
    }

})


export default router