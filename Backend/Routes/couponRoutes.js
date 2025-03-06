import express from "express"
import { authenticate } from "../middlewares/auth.js";
import { getCoupon, validateCoupon } from "../Controllers/couponController.js";
const router = express.Router();

router.get("/",authenticate,getCoupon);
router.get("/validate",authenticate,validateCoupon);

export default router