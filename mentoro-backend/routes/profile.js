const express = require('express');
const router = express.Router();
const User = require('../models/user')
const {ensureAuth} = require('../middleware/auth')

// api to access all creator
router.get("/all",async(req,res)=>{
    try {
        const projection = {_id:1,name:1,imageUrl:1,rating:1,reviewCount:1,companyName:1,role:1,expertise:1}
        const query = {about:{$ne:null}};
        let users = await User.find(query,projection).sort({rating:-1,reviewCount:-1})
        res.send({users});
    } catch (error) {
        console.log(error);
        res.send({error:error})
    }
})

// router.get("/detail/:id",async(req,res)=>{
//     try {
//         const userId = req.params.id;
//         const result = await User.findOne({_id:userId}).populate("session");
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({error});
//     }
// })

router.get("/get/:id",async(req,res)=>{
    try {
        const userId = req.params.id;
        const result = await User.findOne({_id:userId});
        res.send(result)
    } catch (error) {
        console.log(error);
    }
})

router.get("/availability/:id",async(req,res)=>{
    try {
        const userId = req.params.id;
        const result = await User.findOne({_id:userId},{_id:0,availability:1})
        res.send({availability:result.availability});
    } catch (error) {
        console.log(error);
        res.status(501).send({error})
    }
})

router.post("/update",ensureAuth,async(req,res)=>{
    try {
        const response = await User.findOneAndUpdate({_id:req.locals},req.body);
        res.send({success: true});
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;