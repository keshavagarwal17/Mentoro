// const User = require('../models/user')
module.exports = {
    ensureAuth: (req,res,next)=>{
        const token = req.header("Authorization").replace("Bearer ", "");
        if(!token){
            res.status(401).send({error: "User is not Authenticated"});
            return;
        }else{
            req.locals = token;
            next();
        }
        // User.findOne({_id:token})
        // .then((user)=>{
        //     if(user){
        //         req.locals = user;
        //         next();
        //     }else{
        //         res.send({error:"User is Not Authenticated"})
        //     }
        // })
    }
}