import express from "express"

import { getProfile, login, logout, signup, toChangeProfile } from "../Controllers/userController.js";
import {authenticate} from "../middlewares/auth.js"

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)

 router.get("/profile",authenticate,getProfile)


router.get("/logout",logout)
router.patch("/change-profile",authenticate,toChangeProfile);
export default router