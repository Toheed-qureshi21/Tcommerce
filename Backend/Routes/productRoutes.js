import express from "express"
import { changeFeatured, createProduct, deleteProduct, getAllProductsOfAdmin, getFeaturedProducts, getProductsByCategory, getProductsByRecommedations } from "../Controllers/productController.js";
import { authenticate, authorized } from "../middlewares/auth.js";

const router = express.Router();

router.get("/",authenticate,authorized,getAllProductsOfAdmin);
router.get("/featured",getFeaturedProducts)
router.get("/category/:category",getProductsByCategory)
router.get("/recommendations",getProductsByRecommedations)
router.post("/create-product",authenticate,authorized,createProduct)
router.patch("/update/:id",authenticate,authorized,changeFeatured)
router.delete("/delete/:id",authenticate,authorized,deleteProduct)

export default router