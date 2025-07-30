const express = require('express')
const app = express()
const cors = require("cors")
const User = require('./db.js')
const bcrypt = require("bcrypt")
const userRouter = require("./routes/User.js")
const mainRouter = require("./routes/index.js")

app.use(express.json())
app.use(cors())
app.use("/api/v1", mainRouter)
app.use("/api/user/v1",userRouter)



app.listen(3000,()=>{
    console.log("App is running in port 3000")
})
//user SignUp
//user SignIn
//Update User Details firstname last name password
