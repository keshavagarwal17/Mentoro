const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
    text:{
        type:String,
        required: true
    },
    from:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    to:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    sessionRequestId:{
        type: Schema.Types.ObjectId, 
        ref: 'Session'
    },
},{timestamps: true})

const Message = mongoose.model("Message",MessageSchema);
module.exports = Message;