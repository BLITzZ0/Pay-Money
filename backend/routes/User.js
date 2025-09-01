const express = require('express');
const {User, Account, Otp} = require('../db');
const bcrypt = require("bcrypt")
const router = express.Router();
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const zod = require('zod')
const isAuthenticated = require("../Middleware/AuthMiddleware.js")

const Signup_schema = zod.object({
    User_name : zod.string().email({Message: "User name must email"}),
    first_name: zod.string().min(2,"First Nmae is required."),
    Last_name: zod.string().min(2,"Last name is required"),
    Password: zod.string().min(8,"Password must be of minimum 8 charcters")
})

const login_schema = zod.object({
    User_name : zod.string().email({Message: "User name must email"}),
    Password: zod.string()
})

const updateUserSchema = zod.object({
  first_name: zod.string().min(1, "First name cannot be empty").optional(),
  Last_name: zod.string().min(1, "Last name cannot be empty").optional(),
  Password: zod.string().min(6, "Password must be at least 6 characters").optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

const SearchSchema = zod.object({
    filter:zod.string().optional()
})


//Adding a new User
router.post("/add_user",async (req,res)=>{
    const Parsed_result = Signup_schema.safeParse(req.body)
    if (!Parsed_result.success) {
        return res.status(400).json({ Message: "Input Validation Failed", errors: Parsed_result.error.errors });
    }

    const { User_name, first_name, Last_name, Password } = Parsed_result.data;
    const UserId = Parsed_result._id

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

    //Adding random balance from 1 to 1000000 for the currenly added user.
    try{
        const saved_user = await newUser.save();
        await Account.create({
            userId:saved_user._id,
            balance:Math.floor(1 + Math.random() * 1000000)
        });
        res.status(201).json({message:"User created Sucessfully"})
        // console.log("User created Sucessfully")
    }catch(err){
        res.status(500).json({error:"Error Creating user"})
    }
});


//User login 
router.post("/login_user", async(req,res)=>{

    const Parsed_result = login_schema.safeParse(req.body)
    if(!Parsed_result.success){
        res.status(400).json({Message:"Validation Failed"})
    }

    const {User_name,Password} = Parsed_result.data;
    const existing_user=await User.findOne({User_name});

    if(!existing_user){
        return res.status(400).json({message: 'User DoesNot Exist'})
    }

    const is_match = await bcrypt.compare(Password, existing_user.Password)

    if(!is_match){
        return res.status(401).json({Error : "Invalid Password"})
    }
    const token = jwt.sign(
        {UserId: existing_user._id,User_name: existing_user.User_name, first_name:existing_user.first_name},
        secret,
        {expiresIn: '1h'})
    res.json({Message : "User Logged in sucessfully", token})
})


//User Updates
router.put("/update_user",isAuthenticated, async (req,res)=>{
    try{
        const Parsed_result = updateUserSchema.safeParse(req.body);
        if(!Parsed_result.success){
           return res.status(401).json({Error : "Input Validation Failed"})
        }
        const {User_name, first_name, Last_name, Password} = Parsed_result.data;

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
            {User_name:req.User_name},
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


//Getting all the user 
router.get("/bulk",isAuthenticated,async(req,res)=>{
    const Parsed_result = SearchSchema.safeParse(req.query)
    if(!Parsed_result){
        return res.status(401).json({Error: "Input Validation Failed"})
    }
    const filter = Parsed_result.data.filter || ""; 
    // this is as simple as puttng a like querry in sql.
    try{
        const users = await User.find({
            $or:[{first_name:{"$regex":filter,$options:"i"}},
                {Last_name:{"$regex":filter,$options:"i"}},
                {User_name:{"$regex":filter,$options:"i"}}
            ]
        });
        res.json({
            users:users.map(user =>({
                User_name:user.User_name, 
                first_name:user.first_name,
                Last_name:user.Last_name,
                _id:user._id
            }))
        });
    }catch(err){
        res.status(500).json({Error:"Server Error Occured",message:err.message})
    }
})

router.post("/forget-password",async(req,res)=>{
    const {email} = req.body;
    // console.log(email);
    const user = await User.findOne({User_name: email})
    if(!user){
        return res.status(404).json({Message: "User Doesnot exist"})
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString();
    const hashedotp = await bcrypt.hash(otp,10)

    await Otp.create({
        email, otp: hashedotp, expiresAt: Date.now() + 5 * 60 * 1000
    })

    return res.status(200).json({"otp is " : otp})
    
})

router.post("/verify-otp", async(req,res)=>{
    const {email, otp} = req.body;
    const user = await Otp.findOne({email : email})
    // console.log(otp);
    // console.log(user.otp)
    const result = await bcrypt.compare(otp, user.otp);
    if(result){
        return res.status(200).json({Message: "OTP verified sucessfully"})
    }
    else {
        return res.status(500).json({Message: "OTP verification unsucessfull"})

    }
})

module.exports = router;