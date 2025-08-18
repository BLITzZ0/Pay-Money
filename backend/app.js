const express = require('express')
const app = express()
const cors = require("cors")
require('dotenv').config({ debug: false });
const Port = process.env.PORT
const userRouter = require("./routes/User.js")
const mainRouter = require("./routes/index.js")
const accountRouter = require("./routes/Account.js")


app.use(express.json())
app.use(cors())
app.use("/api/v1", mainRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/account",accountRouter)

app.listen(Port,()=>{
    console.log(`App is running in port ${Port} current time is ${Date.now()}`)
})

 