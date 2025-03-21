import express from "express"
import { login, logout, signup,getProfile } from "../Controllers/userController.js";

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.get("/profile",getProfile)
router.get("/logout",logout)

export default router