import mongoose from "mongoose"


const Messages = new mongoose.Schema(
 {
     conversationId:{
         type:String
     },
     sender:{
         type:String
     },
     text:{
         type:String
     }
 },
   
    { timestamps: true }



)

export default mongoose.model("messages", Messages)