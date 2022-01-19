const mongoose = require("mongoose");
const { Schema } = mongoose;

const SessionRequestSchema = new Schema({
    amount:{
        type: Number,
        required: true
    },
    user:{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    session:{
        type: Schema.Types.ObjectId, 
        ref: 'Session'
    },
    mentor:{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    sessionSchedule:{
        type: Object,
    },
    sessionLink:{
        type:String
    },
    razorpayOrderId:{
        type: String
    },
    razorpayPaymentId:{
        type: String
    },
    isCancel:{
        type: Boolean,
        default: false
    },
    eventId:{
        type: String
    }
},{timestamps: true})

const SessionRequest = mongoose.model("SessionRequest",SessionRequestSchema);
module.exports = SessionRequest;