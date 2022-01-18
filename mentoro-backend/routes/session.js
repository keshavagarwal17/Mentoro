const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Session = require("../models/session")
const {ensureAuth} = require('../middleware/auth')

router.post("/create",ensureAuth,async(req,res)=>{
    try {
        const mentorId = req.locals;
        const session = new Session({
            ...(req.body),
            mentor: mentorId
        });
        await session.save();
        let user = await User.findOne({_id: mentorId})
        user.session.push(session);
        await user.save();
        res.send({success: true});
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})

//put request to update session
router.put("/update/:id",ensureAuth,async(req,res)=>{
    try {
        const mentorId = req.locals;
        const sessionId = req.params.id;
        await Session.findOneAndUpdate({_id:sessionId,mentor:mentorId},req.body)
        res.send({success:true});
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})

//find one particular session detail
router.get("/get-session/:id",async(req,res)=>{
    try {
        const sessionId = req.params.id;
        let data = await Session.findOne({_id:sessionId}).populate("mentor")
        res.send({session:data});
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

// all session of a particular mentor with user info
router.get("/get/:id",async(req,res)=>{
    try {
        const userId = req.params.id;
        User.
        findById(userId).
        populate({
            path:"session",
            match:{public:{$eq:true}}
        }).exec((err,user)=>{    
            res.send(user)
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})

//all session for mentor dashboard
router.get("/get-all",ensureAuth,async(req,res)=>{
    try {
        const userId = req.locals;
        const session = await Session.find({mentor:userId})
        res.send(session);
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})


module.exports = router;