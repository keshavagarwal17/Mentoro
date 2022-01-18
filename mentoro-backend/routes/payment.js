const express = require('express');
const router = express.Router();
const Razorpay = require("razorpay")
const {validatePaymentVerification} = require('razorpay/dist/utils/razorpay-utils')
const Request = require('../models/request')
const User = require("../models/user")
const {ensureAuth} = require("../middleware/auth")

router.post("/order",async(req,res)=>{
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
        const {amount} = req.body;
        const response = await instance.orders.create({
            amount: amount*100,
            currency: "INR"
        })
        res.send({order_id:response.id})
    } catch (error) {
        console.log(error);
    }
})


//router to validate payment
router.post("/validate",async(req,res)=>{
    const {razorpayOrderId,razorpayPaymentId,signature} = req.body;
    const response = await validatePaymentVerification({"order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, process.env.RAZORPAY_KEY_SECRET);
    res.send({valid:response})
})

//router to refund money
router.post("/refund",ensureAuth,async(req,res)=>{
    try {
        var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
        const mentorId = req.locals;
        const requestId = req.body.id;
        const response = await Request.findOne({_id:requestId,mentor:mentorId})
        const refundRes = await instance.payments.refund(response.razorpayPaymentId,{
            "amount": response.amount*100,
            "speed": "normal"
        })
        res.send({success:true})
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

const isUpcoming = (schedule)=>{
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var date = dateObj.getDate();
    var year = dateObj.getFullYear();
    if(schedule.year > year) return true;
    if(schedule.year==year && schedule.month > month) return true;
    if(schedule.year== year && schedule.month== month && schedule.date >= date) return true;
    return false;
}

//route to transfer money
router.post("/transfer",ensureAuth,async(req,res)=>{
    try {
        //linked account id
        //mentorId -> to find amount
        const userId = req.locals;
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })
        let data = await Request.find({mentor:userId,isCancel:false});
        let user = await User.findOne({_id:userId});
        let reserveAmount  =0;
        for(let i=0;i<data.length;i++){
            if(isUpcoming(data[i].sessionSchedule)){
                reserveAmount += data[i].amount;
            }
        }
        let transferAmount = user.totalEarning - user.transferredMoney - reserveAmount;
        //currently this is not active
        // await instance.transfers.create({
        //     "amount": transferAmount*90,
        //     "currency": "INR",
        //     "account": user.linkedAccount
        // })
        await User.findOneAndUpdate({_id:userId},{$inc:{transferredMoney: transferAmount}})
        res.send({success:true});
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;