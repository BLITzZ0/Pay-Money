const express = require('express');
const {User, Account, Otp} = require('../db');
const bcrypt = require("bcrypt")
const router = express.Router();
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
const zod = require('zod')
const isAuthenticated = require("../Middleware/AuthMiddleware.js")
const sendEmail = require("../Middleware/Mailer.js")

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

const resetPasswordSchema = zod.object({
    email:zod.string().email("Valid Email Required"),
    otp:zod.string().length(6,"OTP must be of 6 digits."),
    newPassword:zod.string()
    .min(8,"Password must be of minimum 8 letters")
    .regex(/[A-Z]/,"Password must contain at least one Uppercase letter")
    .regex(/[a-z]/,"Password must contain at least one lowercase letter")
    .regex(/[0-9]/,"Password must contain atleast one number")
    .regex(/[?!@#$%&*]/,"Password must contain at least one special character")
});

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
    try{
        const {email} = req.body;
        // console.log(email);
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({User_name: email})
        if(!user){
            return res.status(404).json({Message: "User Doesnot exist"})
        }

        const otp = Math.floor(100000 + Math.random()*900000).toString();
        const hashedotp = await bcrypt.hash(otp,10)

        await Otp.findOneAndUpdate(
            {email}, {otp: hashedotp, expiresAt: Date.now() + 5 * 60 * 1000},{upsert: true}
        )

        await sendEmail(email,"Pay-Money Password Reset OTP",
            `Your OTP for verification is ${otp}. It will expire in 5 minutes.`
        );

        console.log("email sent")
        return res.status(200).json({Message : "Your Otp is sent to your email"})
    }catch(error){
        return res.status(500).json({error : "Something Went wrong " + error.message})
    }
})

router.post("/reset-password", async(req,res)=>{
    try{
        const parsed = resetPasswordSchema.safeParse(req.body)
        if(!parsed.success){
            return res.status(400).json({error:"Validation Issue",details:parsed.error.errors})
        }
        const {email, otp, newPassword} = parsed.data;

        if(!email || !otp){
            return res.status(400).json({error : "Email , OTP are required"})
        }

        const otpEntry = await Otp.findOne({email})

        if(!otpEntry){
            return res.status(400).json({error: "No OTP request found for this email"})
        }

        if(otpEntry.expiresAt < Date.now()){
            return res.status(400).json({error : "OTP has expired"})
        }

        const isMatch = await bcrypt.compare(otp,otpEntry.otp)
        if(!isMatch){
            return res.status(400).json({error: "Incorrect OTP"})
        }

        const hashedpassword = await bcrypt.hash(newPassword,10)

        const updateUser = await User.findOneAndUpdate(
            {User_name:email},
            {Password:hashedpassword},
            {new: true}
        )

        if(!updateUser){
            return res.status(404).json({error: "User Not Found"})
        }

        await Otp.deleteOne({email})
        res.status(200).json({Message: "Password Updated Sucessfully"})
    }catch(error){
        res.status(500).json({Message: "Something Went Wrong" + error.message})
    }
})

module.exports = router;