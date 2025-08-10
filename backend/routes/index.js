const express= require('express')
const router = express.Router();
const userRouter = require('./User.js')
const accountRouter = require("./Account.js")

router.use("/user",userRouter)
router.use("/account",accountRouter)

module.exports = router;