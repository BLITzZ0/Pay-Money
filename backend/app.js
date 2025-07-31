const express = require('express')
const app = express()
const cors = require("cors")
const Port = process.env.PORT
const userRouter = require("./routes/User.js")
const mainRouter = require("./routes/index.js")

app.use(express.json())
app.use(cors())
app.use("/api/v1", mainRouter)
app.use("/api/user/v1",userRouter)

app.listen(Port,()=>{
    console.log(`App is running in port ${Port}`)
})

//user SignUp
//user SignIn
//Update User Details firstname last name password