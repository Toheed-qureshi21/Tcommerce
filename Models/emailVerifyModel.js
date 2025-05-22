import mongoose from "mongoose";

const verifyEmailSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
        expires:24*60*60*1000
    },
},{
    timestamps:true
});

export const VerifyEmail = mongoose.model("VerifyEmail",verifyEmailSchema);