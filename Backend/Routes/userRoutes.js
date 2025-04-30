import express from "express"

import { forgotPassword, getPasswordPage, getProfile, login, logout, postResetPassword, sendVerificationLink, signup, toChangeProfile, verifyEmailToken } from "../Controllers/userController.js";
import {authenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)

 router.get("/profile",authenticate,getProfile)


router.get("/logout",logout)
router.patch("/change-profile",authenticate,toChangeProfile);
// This controller creates a token and sends it to the user's email
router.post("/reset-password",forgotPassword);
// This function verifies token
router.get("/reset-password/:token",getPasswordPage)
// This fucntion updates password
router.post("/reset-password/:token",postResetPassword)
router.get("/send-verification-link", authenticate, sendVerificationLink)
router.post("/verify-email-link",authenticate, verifyEmailToken)
export default router