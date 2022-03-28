import express from "express";
const router = express.Router()
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.mjs"
import dotenv from "dotenv"

dotenv.config()
router.post("/register", async (req, res) => {
    const { username, email, password,name } = req.body


    const hashedPassword = await bcrypt.hash(password, 10)
    const check = await User.findOne({ email: email })
   
    if (check) {
        return res.send("This user exists already REGISTERED")
        
    }
    try {
        const user = new User({
            userName:name,
            email: email,
            password: hashedPassword
        })

        const createdUser = await user.save()
        res.json("Registracion completed Sucesfully --Log into Accaunt")
    }
    catch (e) {
        console.log(e)
    }

})


router.post("/login", async (req, res) => {

  
    const user = await User.findOne({ email: req.body.email })
    if (!user) { res.status(404).json("User not found"); return }

    const validatPassword=await bcrypt.compare(req.body.password,user.password)
    if(!validatPassword){res.status(400).send("wrong password")}
    if(user&&validatPassword ){
      const   {password,...other}=user
    
       const JWT=  jwt.sign(other,process.env.JWT_SECRET)
        
       res.send(JWT)}
})


export default router