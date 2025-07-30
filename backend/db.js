const mongoose  = require('mongoose')

mongoose.connect('mongodb+srv://ababhishek3005:hLEKNKlv3FYOBefw@cluster0.zeajqiw.mongodb.net/')
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