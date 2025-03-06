import { Product } from "../Models/productModel.js";
import { User } from "../Models/userModel.js";
import { TryCatch } from "../Utils/TryCatch.js";

export const getAllCartItems = TryCatch(async (req, res) => {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    const cartItems = products.map((product) => {
        const item = req.user.cartItems.find((item) => item.id === product._id);
        return {
            ...product.toJSON(),
            quantity: item.quantity
        }

    });
    return res.status(200).json({ cartItems });
});

export const addProductToCart = TryCatch(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = await User.cartItems.find((item) => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        user.cartItems.push(productId)
    }
    await user.save();
    const cartItems = user.cartItems;
    return res.status(201).json({ cartItems, message: "Product added to cart successfully" });

});

export const removeProductFromCart = TryCatch(async (req, res) => {
    const { productId } = req.body;
    const user = req.user;
    user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    await user.save();
    const cartItems = user.cartItems;
    return res.status(200).json({ cartItems, message: "Product removed from cart successfully" });
});

export const updateProductQuantity = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === id);
    if (existingItem) {
        if (quantity === 0) {
            user.cartItems = user.cartItems.filter((item) => item.id !== id);
            await user.save();
            const cartItems = user.cartItems;
            return res.status(200).json({ cartItems, message: "Product removed from cart successfully" });
        }
        existingItem.quantity = quantity;
        await user.save();
        const cartItems = user.cartItems;
        return res.status(200).json({ cartItems, message: "Product quantity updated successfully" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }

});