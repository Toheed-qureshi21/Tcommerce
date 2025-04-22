import { stripe } from "../Lib/stripe.js";
import {User} from "../Models/userModel.js"
import { Coupon } from "../Models/couponModel.js";
import { Order } from "../Models/orderModel.js";
import { TryCatch } from "../Utils/TryCatch.js"
import { createNewCoupon, createStripeCoupon } from "../Utils/utils.js";

export const createCheckOutSession = TryCatch(async (req, res) => {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Invalid products array" });
    }

    let totalAmount = 0;
    const items = products.map((product) => {
        const amount = product.price * 100    //Because we have used dollar in stipe that's why it support cents
        totalAmount += amount * product.quantity;
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: [product.image]
                },
                unit_amount: amount,

            },
            quantity: product.quantity || 1,
        }

    });

    let coupon = null;
    if (couponCode) {
        coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
        coupon ? totalAmount -= Math.round((totalAmount * (coupon.discount) / 100)) : null;
    }

    // Integrating stipe payments by creating checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success-purchase?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel-purchase`,
        discounts: coupon ? [{
            coupon: await createStripeCoupon(coupon.discount)
        }] : [],
        metadata: {
            userId: req.user._id.toString(),
            couponCode: couponCode || "",
            products: JSON.stringify(
                products.map((product) => ({
                    id: product._id,
                    quantity: product.quantity,
                    price: product.price
                }))
            ),
        },
    });
    // IF THE PURCHASE AMOUNT IS GREATER THAN 100 DOLLAR THEN WE HAVE TO CREATE A COUPON OF 10 PERCENT
    if (totalAmount >= 10000) {
        await createNewCoupon(req.user._id);
    }
    // Total amount is in cents that's why we have to convert it to dollars
    return res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });


});

export const verifyCheckOutSession = TryCatch(async (req, res) => {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
        // Check if an order already exists for this session
        const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

        if (existingOrder) {
            // Return the existing order if it's already in the database
            return res.status(200).json({
                success: true,
                message: "Order already exists for this session.",
                orderId: existingOrder._id, // Return the existing order ID
            });
        }

        // If a coupon code is used, deactivate it
        if (session.metadata.couponCode) {
            await Coupon.findOneAndUpdate(
                {
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId,
                },
                {
                    isActive: false,
                }
            );
        }

        // Create a new order
        const products = JSON.parse(session.metadata.products);
        const newOrder = new Order({
            user: session.metadata.userId,
            products: products.map((product) => ({
                product: product.id,
                quantity: product.quantity,
                price: product.price,
            })),
            totalAmount: session.amount_total / 100,  // Convert from cents to dollars
            stripeSessionId: sessionId,
        });

        await newOrder.save();
        await User.findByIdAndUpdate(session.metadata.userId, {
            $set: { cartItems: [] }
          });
        return res.status(200).json({
            success: true,
            message: "Payment successful, order created, and coupon deactivated if used.",
            orderId: newOrder._id,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Payment failed or not completed.",
        });
    }
});

