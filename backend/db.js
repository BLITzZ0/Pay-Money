const mongoose  = require('mongoose');
const { number, date, string } = require('zod');
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

const TransactionSchema = new mongoose.Schema({
    transactionId:{
        type:String,
        required:true,
        unique:true
    },
    from:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    to:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    time:{
        type:date,
        default:Date.now()
    },
    status:{
        type: String,
        enum: ["success", "failed", "pending"], 
        default: "success"
    },
    reason:{
        type: String,
        required:false
    }
})

const Account = mongoose.model('Account',AccountSchema)
const User = mongoose.model('User',UserSchema);
const Transaction = mongoose.model('Transaction',TransactionSchema)

module.exports = {User,Account,Transaction};