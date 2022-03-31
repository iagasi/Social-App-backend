import express from "express";
import Conversation from "../models/Conversation.mjs"
const router = express.Router()


router.post("/",  (req, res) => {
    const { senderId, receiverId } = req.body
    if (!senderId || !receiverId) {
        res.status(403).send("sender and receiver id is required")
        return
    }
    try {
        const newConversation = new Conversation({
            members: [senderId, receiverId]
        })

        newConversation.save()
        if (newConversation) {
            res.send("conversation Created")
        }
        else {
            res.status(403)
        }
    }
    catch (err) {
        console.log(err);
    }

})
 router.get("/:userId", async (req,res)=>{
const {userId}=req.params
try{
const conversations= await Conversation.find({
    members:{$in :[userId]}
})
res.send(conversations)
}

catch(err){
console.log(err);
}
 })



export default router