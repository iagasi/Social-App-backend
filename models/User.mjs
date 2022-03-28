import mongoose from "mongoose"


const UserSchecma = new mongoose.Schema({

    userName: {
        type: String,
        require: true,
        min: 3,
        max: 15,
default:"Name Not Provided"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "/images/users/noimage.jpg"
    },
    coverPicture: {
        type: String,
        default: ""
    },

    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: String,
        emun: [1, 2, 3]
    }
},
    { timestamps: true }



)

export default mongoose.model("users", UserSchecma)