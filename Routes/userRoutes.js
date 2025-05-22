import express from "express"

import { forgotPassword, getGithubCallback, getGithubConsentPage, getGoogleCallback, getGoogleConsentPage, getPasswordPage, getProfile, login, logout, postResetPassword, sendVerificationLink, signup, toChangeProfile, verifyEmailToken } from "../Controllers/userController.js";
import {authenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)

 router.get("/profile",authenticate,getProfile)


router.get("/logout",authenticate,logout)
router.patch("/change-profile",authenticate,toChangeProfile);
// This controller creates a token and sends it to the user's email
router.post("/reset-password",forgotPassword);
// This function verifies token
router.get("/reset-password/:token",getPasswordPage)
// This fucntion updates password
router.post("/reset-password/:token",postResetPassword)
router.get("/send-verification-link", authenticate, sendVerificationLink)
router.post("/verify-email-link",authenticate, verifyEmailToken)

// routes for google oauth
router.get("/google",getGoogleConsentPage);
router.get("/google/callback",getGoogleCallback)

// routes for github aouth
router.get("/github",getGithubConsentPage);
router.get("/github/callback",getGithubCallback);

export default router