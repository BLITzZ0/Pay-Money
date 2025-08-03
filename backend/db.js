const mongoose  = require('mongoose')
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(()=> console.log("Connection SucessFull"))
    .catch(err => console.log("Error Occured", err))

const UserSchema = new mongoose.Schema({
    User_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    Password: {
        type: String,
        required: true,
        minLength: 6
    },
    first_name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    Last_name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});


const AccountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
})

const Account = mongoose.model('Account',AccountSchema)
const User = mongoose.model('User',UserSchema);

module.exports = {User,Account};