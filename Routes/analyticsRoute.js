import express from "express"
import { authenticate, authorized } from "../middlewares/auth.js";
import { getAnalytics } from "../Controllers/analyticsController.js";

const router = express.Router();

router.get("/",authenticate,authorized,getAnalytics)

export default router;