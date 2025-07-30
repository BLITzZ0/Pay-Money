const express = require('express');
const User = require('../db');
const bcrypt = require("bcrypt")
const router = express.Router();

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
        newUser.save();
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
        return res.status(201).json({Error : "Invalid Password"})
    }

    // if(is_match){
    //     res.json({Message : "User Logged in sucessfully"})
    // }
    res.json({Message : "User Logged in sucessfully"})
})
module.exports = router;