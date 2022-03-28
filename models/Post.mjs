import mongoose from "mongoose"


const PostSchecma = new mongoose.Schema({

    userId: {
        type: String,
        require: true,


    },
    description: {
        type: String,
        default: ""


    },
    img: {
        type: String,
        defauilt: ""
    },
    likes: {
        type: Array,
        default: []
    },

    comments:{
        type:Array,
        default:[]
    }

},
    { timestamps: true }



)

export default mongoose.model("posts", PostSchecma)