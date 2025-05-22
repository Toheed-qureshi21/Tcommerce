import express from "express"

import { createCheckOutSession, verifyCheckOutSession } from "../Controllers/paymentController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-checkout-session",authenticate,createCheckOutSession);
router.post("/verify-checkout-session",authenticate,verifyCheckOutSession);

export default router