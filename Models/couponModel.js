import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    discount:{
        type:Number,
        min:0,
        max:100,
        required:true
    },
    expiresDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
    
},{
    timestamps:true
});

export const Coupon = mongoose.model("Coupon",couponSchema);