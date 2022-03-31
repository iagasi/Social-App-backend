import express from "express";
import Messages from "../models/Messages.mjs";
const router = express.Router()


router.post("/", (req, res) => {
    const message = new Messages(req.body)
    try {
        message.save()
         res.send(message) 
     
    }
    catch (err) {
        console.log(err);

    }
})

router.get("/:conversationId",async(req,res)=>{
    const{conversationId}=req.params
try{
const allMessages=await Messages.find({
    conversationId:conversationId
})

allMessages?res.send(allMessages):res.send("error")
}

catch(err){
    console.log(err);

}
})



export default router