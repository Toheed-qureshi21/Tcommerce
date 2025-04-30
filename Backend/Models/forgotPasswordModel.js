import mongoose from "mongoose";

const forgotPasswordSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token_hash:{
        type:String,
        required:true,
        unique:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*60*1000,
    }
},{
        timestamps:true,
}
);

export const ForgotPassword = mongoose.model("ForgotPassword",forgotPasswordSchema);