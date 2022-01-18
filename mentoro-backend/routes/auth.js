const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")
const {OAuth2Client} = require("google-auth-library")
const {google} = require("googleapis")
dotenv.config("./.env");
const User = require('../models/user')

const oauth2client = new google.auth.OAuth2(
  process.env.client_id,
  process.env.client_secret,
  process.env.fehost
)

const client = new OAuth2Client(process.env.client_id)  

router.post("/login",async(req,res)=>{
  try {
    const {code} = req.body;
    let response = await oauth2client.getToken(code);
    const tokenId = response.tokens.id_token;
    const refreshToken = response.tokens.refresh_token;
    response = await client.verifyIdToken({idToken:tokenId,audience:process.env.client_id})
    const {email,name} = response.payload;
    let result = await User.findOne({email});
    if(!result){
      const user = new User({email,name,refreshToken});
      result = await user.save();
    }
    res.send({id: result._id});
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;