const mongoose  = require('mongoose')
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(()=> console.log("Connection SucessFull"))
    .catch(err => console.log("Error Occured", err))

const UserSchema = new mongoose.Schema({
    User_name:String,
    first_name: String,
    Last_name : String,
    Password : String
})

const User = mongoose.model('User',UserSchema);
module.exports = User;