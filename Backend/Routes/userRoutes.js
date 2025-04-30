import express from "express"

import { forgotPassword, getPasswordPage, getProfile, login, logout, postResetPassword, signup, toChangeProfile } from "../Controllers/userController.js";
import {authenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)

 router.get("/profile",authenticate,getProfile)


router.get("/logout",logout)
router.patch("/change-profile",authenticate,toChangeProfile);
// This controller creates a token and sends it to the user's email
router.post("/reset-password",forgotPassword);
// This token will 
router.get("/reset-password/:token",getPasswordPage)
router.post("/reset-password/:token",postResetPassword)

export default router