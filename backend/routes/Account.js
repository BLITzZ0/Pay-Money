const express = require('express');
const router = express.Router();
const isAuthenticated = require("../Middleware/AuthMiddleware.js");
import { Account } from '../db.js';

router.get("/balance", isAuthenticated,(req,res)=>{
    
})


module.exports = router;