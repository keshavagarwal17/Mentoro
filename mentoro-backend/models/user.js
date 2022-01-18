const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required:true
    },
    companyName:{
        type: String
    },
    role: {
        type: String
    },
    expertise: {
        type: String
    },
    about: {
        type: String
    },
    imageUrl: {
        type: String,
        default: "/assets/user.jpg"
    },
    rating:{
        type: Number,
        default: 0
    },
    reviewCount:{
        type: Number,
        default: 0
    },
    requests: [{
        type: Schema.Types.ObjectId, 
        ref: 'SessionRequest'
    }],
    session: [{
        type: Schema.Types.ObjectId, 
        ref: 'Session'
    }],
    availability:{
        type: Object,
        default: {
            Sunday:[],
            Monday:[],
            Tuesday:[],
            Wednesday:[],
            Thursday:[],
            Friday:[],
            Saturday:[],
        }
    },
    totalEarning:{
        type: Number,
        default: 0
    },
    transferredMoney:{
        type: Number,
        default: 0
    },
    ifscCode:{
        type:String
    },
    accountNumber:{
        type:String
    },
    beneficiaryName:{
        type:String
    },
    bankInfoUpdated:{
        type: Date
    },
    linkedAccount: {
        type: String
    }
})

const User = mongoose.model("User",UserSchema);
module.exports = User;