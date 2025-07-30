const express= require('express')
const router = express.Router();
const userRouter = require('./User.js')

router.use("/user",userRouter)


module.exports = router;