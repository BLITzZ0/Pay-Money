const express = require('express');
const router = express.Router();
const isAuthenticated = require("../Middleware/AuthMiddleware.js");
const { Account } = require('../db.js');

router.post("/balance", isAuthenticated,async(req,res)=>{
    try{
        const userId = req.UserId
        const User = await Account.findOne({userId:userId})
        if(!User){
            return res.status(401).json({message:"User Not found"})
    }
    return res.status(200).json({Balance : (User.balance / 100)})
    }catch(err){
        return res.status(500).json({Error:err.message})
    }
})


module.exports = router;