import mongoose from "mongoose"


const Conversation = new mongoose.Schema(
    {
        members: {
            type: Array
        }
    },

    { timestamps: true }



)

export default mongoose.model("conversations", Conversation)