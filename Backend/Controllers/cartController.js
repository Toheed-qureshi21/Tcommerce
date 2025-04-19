import { Product } from "../Models/productModel.js";
import { User } from "../Models/userModel.js";
import { TryCatch } from "../Utils/TryCatch.js";

export const getAllCartItems = TryCatch(async (req, res) => {
  const cartItemsData = req.user.cartItems;

  const productIds = cartItemsData.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  const cartItems = products?.map(product => {
    const item = cartItemsData?.find(ci => ci?.product?.toString() === product?._id?.toString());
    return {
      ...product.toJSON(),
      quantity: item?.quantity || 1
    };
  });

  return res.status(200).json({ cartItems });
});
  

export const addProductToCart = TryCatch(async (req, res) => {
  const { productId } = req.body;
  const user = req.user;

  // Check if the product already exists in the cart
  const existingItem = user.cartItems.find(
    (item) => item?.product?.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cartItems.push({
      product: productId,
      quantity: 1
    });
  }

  await user.save();

  // Re-fetch user with populated product details
  const updatedUser = await User.findById(user._id).populate("cartItems.product");

  const cartItems = updatedUser.cartItems.map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    description: item.product.description,
    price: item.product.price,
    image: item.product.image,
    quantity: item.quantity
  }));

  return res.status(201).json({
    cartItems,
    message: "Product added to cart successfully"
  });
});



export const removeProductFromCart = TryCatch(async (req, res) => {
  const { productId } = req.params; 
  
  const user = req.user;
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  // Remove the cart item by matching the product's _id field
  const initialCartLength = user.cartItems.length;
  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  const finalCartLength = user.cartItems.length;

  if (initialCartLength === finalCartLength) {
    return res.status(404).json({ message: "Product not found in cart" });
  }
  await user.save();
  const updatedUser = await User.findById(user._id).populate("cartItems.product");

  const cartItems = updatedUser.cartItems
    .filter((item) => item.product)  // Ensure valid product reference
    .map((item) => ({
      productId: item.product._id,  // Correctly reference the product's _id
      name: item.product.name,
      description: item.product.description,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity
    }));

  return res.status(200).json({
    cartItems,                       // Return the updated list of cart items
    message: "Product removed from cart successfully"
  });
});


export const updateProductQuantity = TryCatch(async (req, res) => {
  const { id } = req.params; // product ID
  const { quantity } = req.body;
  const user = req.user;

  // Validate quantity
  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ message: "Invalid quantity value" });
  }

  // Find existing cart item
  const existingItem = user.cartItems.find(
    (item) => item.product?.toString() === id
  );

  if (!existingItem) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  // Update or remove
  if (quantity === 0) {
    user.cartItems = user.cartItems.filter(
      (item) => item.product?.toString() !== id
    );
  } else {
    existingItem.quantity = quantity;
  }

  await user.save();

  // Re-fetch user with populated product details
  const updatedUser = await User.findById(user._id).populate("cartItems.product");

  // Format response with full product info
  const cartItems = updatedUser.cartItems
    .filter((item) => item.product) // Prevent undefined crash
    .map((item) => ({
      ...item.product.toJSON(),
      quantity: item.quantity
    }));

  return res.status(200).json({
    cartItems,
    message: quantity === 0
      ? "Product removed from cart successfully"
      : "Product quantity updated successfully"
  });
});


