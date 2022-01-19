const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Request = require("../models/request")
const {ensureAuth} = require('../middleware/auth')
const {google} = require("googleapis");


//get total session of a cur mentor
router.get("/mentor/get-all",ensureAuth,async(req,res)=>{
    try {
        const userId = req.locals;
        let data = await Request.find({mentor:userId}).populate("session").populate("user")
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

//get total session of a cur user
router.get("/user/get-all",ensureAuth,async(req,res)=>{
    try {
        const userId = req.locals;
        let data = await Request.find({user:userId}).populate("session").populate("mentor")
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})


//route to update session link
router.post("/update-link",ensureAuth,async(req,res)=>{
    try {
        const {link,requestId} = req.body;
        const mentor = req.locals
        await Request.findOneAndUpdate({_id:requestId,mentor},{sessionLink:link})
        res.send({success:true})
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

//book your slot
router.post("/book",ensureAuth,async(req,res)=>{
    try {
        const userId = req.locals;
        const request = new Request({...req.body,user:userId})
        await request.save();
        await User.findOneAndUpdate({_id:req.body.mentor},{$inc:{totalEarning:req.body.amount}})
        res.send({success:true})
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

//find slots of particular day
router.get("/find/:id",async(req,res)=>{
    try {
        let {date,month,year} = req.query;
        date = parseInt(date);
        month = parseInt(month);
        year = parseInt(year);
        const id = req.params.id;
        let data = await Request.find({mentor:id,isCancel:false,'sessionSchedule.date':date,'sessionSchedule.month':month,'sessionSchedule.year':year},"sessionSchedule");
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

//cancel a event
const oauth2client = new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    process.env.fehost
)

router.put("/cancel/:id",ensureAuth,async(req,res)=>{
    try {
        const requestId = req.params.id;
        const mentorId = req.locals;
        const calendar = google.calendar("v3");
        //cancel event from db
        const event = await Request.findOneAndUpdate({_id:requestId,mentor:mentorId},{isCancel:true});

        //update mentor total earning
        const user = await User.findOneAndUpdate({_id:mentorId},{$inc:{totalEarning:-event.amount}})

        //cancel event from google calender
        oauth2client.setCredentials({refresh_token:user.refreshToken})

        await calendar.events.delete({
            auth: oauth2client,
            calendarId: 'primary',
            eventId: event.eventId
        });
        res.send({success:true})
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

module.exports = router;