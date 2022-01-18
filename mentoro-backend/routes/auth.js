const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")
const {OAuth2Client} = require("google-auth-library")
dotenv.config("./.env");
const User = require('../models/user')

const client = new OAuth2Client(process.env.client_id)

router.post("/login",async(req,res)=>{
  try {
    const {tokenId } = req.body;
    const response = await client.verifyIdToken({idToken:tokenId,audience:process.env.client_id})
    const {email,name} = response.payload;
    let result = await User.findOne({email});
    if(!result){
      const user = new User({email,name});
      result = await user.save();
    }
    res.send({id: result._id});
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;