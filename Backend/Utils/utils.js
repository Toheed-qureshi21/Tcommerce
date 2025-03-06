import { stripe } from "../Lib/stripe.js"
import { Coupon } from "../Models/couponModel.js";

export const createStripeCoupon = async (discount) => {
        const coupon = await stripe.coupons.create({
                percent_off: discount,
                duration: "once",
        });

        return coupon.id;
}
export const createNewCoupon = async (userId) => {
        await Coupon.findOneAndDelete({ userId });
        const newCoupon = new Coupon({
                code: "DISCOUNT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
                discount: 10,
                expiresDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                userId: userId,
        });

        await newCoupon.save();
        return newCoupon.code;
}