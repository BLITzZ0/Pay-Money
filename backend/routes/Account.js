const express = require('express');
const router = express.Router();
const zod = require('zod');
const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const isAuthenticated = require("../Middleware/AuthMiddleware.js");
const { User, Account, Transaction } = require('../db.js');

// Zod schema for request validation
const transfer_schema = zod.object({
    to: zod.string(),
    amount: zod.number().positive("Amount must be greater than 0").finite("Amount must be valid")
});

// GET Balance
router.post("/balance", isAuthenticated, async (req, res) => {
    try {
        const userId = req.UserId;
        const account = await Account.findOne({ userId });

        if (!account) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ Balance: account.balance / 100 });
    } catch (err) {
        return res.status(500).json({ Error: err.message });
    }
});

// POST Transfer
router.post("/transfer", isAuthenticated, async (req, res) => {
    const session = await mongoose.startSession();

    let failureReason = null;
    let Sender = null;
    let Receiver = null;
    let amount = null;
    let Transaction_success = false;

    try {
        const user_id = req.UserId;

        // Validate request body
        const parsed = transfer_schema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ Message: "Input validation failed" });
        }

        ({ to, amount } = parsed.data); // Extract validated fields

        session.startTransaction();

        // Fetch sender account
        Sender = await Account.findOne({ userId: user_id }).session(session);
        if (!Sender) {
            failureReason = "Sender account not found";
            throw new Error(failureReason);
        }

        // Fetch receiver user
        Receiver = await User.findOne({ User_name: to }).session(session);
        if (!Receiver) {
            failureReason = "Receiver user not found";
            throw new Error(failureReason);
        }

        // Fetch receiver account
        const ReceiverAcc = await Account.findOne({ userId: Receiver._id }).session(session);
        if (!ReceiverAcc) {
            failureReason = "Receiver account does not exist";
            throw new Error(failureReason);
        }

        // Prevent self-transfer
        if (Sender.userId.toString() === ReceiverAcc.userId.toString()) {
            failureReason = "Self-transfer is not allowed";
            throw new Error(failureReason);
        }

        // Check balance
        if (Sender.balance < amount * 100) {
            failureReason = "Insufficient balance";
            throw new Error(failureReason);
        }

        // Debit sender
        await Account.updateOne(
            { userId: Sender.userId },
            { $inc: { balance: -amount * 100 } }
        ).session(session);

        // Credit receiver
        await Account.updateOne(
            { userId: ReceiverAcc.userId },
            { $inc: { balance: amount * 100 } }
        ).session(session);

        // Log success transaction
        transactionId = `TXN-${Date.now()}-${randomUUID()}`;
        await Transaction.create([{
            transactionId,
            from: Sender.userId,
            to: ReceiverAcc.userId,
            amount: amount * 100,
            time: new Date(),
            status: "success"
        }], { session });

        await session.commitTransaction();
        Transaction_success=true;
        return res.status(200).json({ Message: "Transaction successful", transactionId });

    } catch (err) {
        if(!Transaction_success){
            await session.abortTransaction();
        }

        // Log failed transaction only if we know the sender and amount
        if (Sender && amount !== null) {
            await Transaction.create({
                transactionId: `TXN-${Date.now()}-${randomUUID()}`,
                from: Sender.userId,
                to: Receiver ? Receiver._id : null,
                amount: amount * 100,
                time: new Date(),
                status: "failed",
                reason: failureReason || err.message
            });
        }

        return res.status(400).json({ Message: err.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
