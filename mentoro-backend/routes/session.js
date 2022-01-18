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
        res.send({error})
    }
})

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

// all session from a particular user
router.get("/get/:id",async(req,res)=>{
    try {
        const userId = req.params.id;
        User.findById(userId).populate("session").exec((err,user)=>{    
            res.send(user)
        })
    } catch (error) {
        console.log(error);
        res.send({error})
    }
})


module.exports = router;