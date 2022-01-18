const mongoose = require("mongoose");
const { Schema } = mongoose;

const SessionSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    price:{ 
        type: Number,
        require: true
    },
    duration:{
        type: Number,
        required: true
    },
    description:{
        type: String
    },
    mentor:{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    public:{
        type: Boolean,
        default: true
    },
    requests: [{
        type: Schema.Types.ObjectId, 
        ref: 'SessionRequest'
    }]
})

const Session = mongoose.model("Session",SessionSchema);
module.exports = Session;