import express from "express"

import { addProductToCart, getAllCartItems, removeProductFromCart, updateProductQuantity } from "../Controllers/cartController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/",authenticate,getAllCartItems);
router.post("/",authenticate,addProductToCart);
router.delete("/delete/:productId",authenticate,removeProductFromCart);
router.patch("/update/:id",authenticate,updateProductQuantity);

export default router