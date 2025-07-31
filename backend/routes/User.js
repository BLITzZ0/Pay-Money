const express = require('express');
const User = require('../db');
const bcrypt = require("bcrypt")
const router = express.Router();
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
router.get("/",(req,res)=>{
    res.send("Hello World")
})

router.post("/add_user",async (req,res)=>{
    const {User_name,first_name,Last_name,Password} = req.body;

    //checking for duplicate
    const existing_user = await User.findOne({User_name})
    if(existing_user){
        return res.status(400).json({error : "User exist already"});
    }

    const hashedpassword = await bcrypt.hash(Password,10);

    const newUser = new User({
        User_name,
        first_name,
        Last_name,
        Password:hashedpassword
    })

    try{
        await newUser.save();
        res.status(201).json({message:"User created Sucessfully"})
    }catch(err){
        res.status(500).json({error:"Error Creating user"})
    }
});

router.post("/login_user", async(req,res)=>{
    const {User_name,Password} = req.body;
    const existing_user=await User.findOne({User_name});

    if(!existing_user){
        return res.status(400).json({message: 'User DoesNot Exist'})
    }

    const is_match = await bcrypt.compare(Password, existing_user.Password)

    if(!is_match){
        return res.status(401).json({Error : "Invalid Password"})
    }
    const token = jwt.sign({User_name},secret,{expiresIn: '1h'})
    res.json({Message : "User Logged in sucessfully", token})
})

function isAuthenticated(req,res,next){
    const Auth_Header = req.headers.Authorization || req.headers.authorization
    if(!Auth_Header || !Auth_Header.startsWith('Bearer ')){
        return res.status(400).json({Error: "User Not Logged In"})
    }

    const auth_token = Auth_Header.split(' ')[1];

    try{
        const token = jwt.verify(auth_token,secret);
        req.User_name = token.User_name
        next();
    }catch(err){
        return res.status(400).json({message: 'Invalid token'})
    }
}

router.post("/update_user",isAuthenticated, async (req,res)=>{
    try{
        const userId = req.User_name
        const {first_name, Last_name, Password} = req.body;

        const updates = {}
        if(first_name) updates.first_name = first_name
        if(Last_name) updates.Last_name = Last_name
        if(Password){
            const hashedpassword = await bcrypt.hash(Password,10);
            updates.Password = hashedpassword
        }
        if(Object.keys(updates).length === 0){
            return res.status(400).json({Error: "No Valid fields to Update"})
        }

        const updatedUser = await User.findOneAndUpdate(
            {User_name:userId},
            updates,
            {new:true}) // returns the one after updating

        if(!updatedUser){
            return res.status(400).json({Error : "User Not Found."})
        }
        res.status(200).json({
            User:{
                first_name: updatedUser.first_name,
                Last_name: updatedUser.Last_name,
                Password: updatedUser.Password
            }
        })
    }catch(err){
        res.status(500).json({Warning: "Server Error ", error : err.message})
    }


})
module.exports = router;