const express = require('express');
const router = express.Router();
const zod = require('zod');
const mongoose  = require('mongoose');
const isAuthenticated = require("../Middleware/AuthMiddleware.js");
const { User, Account } = require('../db.js');

const transfer_schema=zod.object({
    to:zod.string(),
    amount: zod.number().positive("Amount must be greater than 0").finite("Mount must be valid")
})

router.post("/balance", isAuthenticated,async(req,res)=>{
    try{
        const userId = req.UserId
        const User = await Account.findOne({userId:userId})
        if(!User){
            return res.status(401).json({message:"User Not found"})
    }
    return res.status(200).json({Balance : (User.balance / 100)})
    }catch(err){
        return res.status(500).json({Error:err.message})
    }
})

router.post("/transfer", isAuthenticated, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user_id = req.UserId;

        const Parsed_result = transfer_schema.safeParse(req.body);
        if (!Parsed_result.success) {
            await session.abortTransaction();
            return res.status(400).json({ Message: "Input Validation failed" });
        }

        const { to, amount } = Parsed_result.data;

        const Sender = await Account.findOne({ userId: user_id }).session(session);
        if (!Sender) {
            await session.abortTransaction();
            return res.status(401).json({ Error: "User Not Found" });
        }

        const Receiver = await User.findOne({ User_name: to }).session(session);
        if (!Receiver) {
            await session.abortTransaction();
            return res.status(401).json({ Error: "User Not Found" });
        }

        const Receiver_id = await Account.findOne({ userId: Receiver._id }).session(session);
        if (!Receiver_id) {
            await session.abortTransaction();
            return res.status(404).json({ Error: "Account Does Not Exist" });
        }

        if (Sender.userId.toString() === Receiver_id.userId.toString()) {
            await session.abortTransaction();
            return res.status(400).json({ Error: "Self transfer is not allowed" });
        }

        if (Sender.balance < amount * 100) {
            await session.abortTransaction();
            return res.status(400).json({ Message: "Insufficient Balance" });
        }

        await Account.updateOne(
            { userId: Sender.userId },
            { $inc: { balance: -amount * 100 } }
        ).session(session);

        await Account.updateOne(
            { userId: Receiver_id.userId },
            { $inc: { balance: amount * 100 } }
        ).session(session);

        await session.commitTransaction();
        res.status(200).json({ Message: "Transaction Successful" });

    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ Message: err.message });
    } finally {
        session.endSession();
    }
});


module.exports = router;