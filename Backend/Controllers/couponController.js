import { Coupon } from "../Models/couponModel.js";
import { TryCatch } from "../Utils/TryCatch.js";

export const getCoupon = TryCatch(async (req, res) => {
            const coupon = await Coupon.findOne({userId:req.user._id,isActive:true});
            return res.status(200).json(coupon || null);
});

export const validateCoupon = TryCatch(async(req,res)=>{
            const {code} = req.body;
            const coupon = await Coupon.findOne({code:code,userId:req.user._id,isActive:true});

            if(!coupon){
                return res.status(400).json({message:"Coupon not found"});
            }
            if (coupon.expiresDate < Date.now()) {
                coupon.isActive = false;
                await coupon.save();
                return res.status(400).json({ message: "Coupon has expired" });
            }

            return res.status(200).json({code:coupon.code,discount:coupon.discount});
});