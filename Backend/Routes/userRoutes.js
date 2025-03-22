import express from "express"

import { getProfile, login, logout, signup } from "../Controllers/userController.js";

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)

 router.get("/profile",getProfile)
router.get("/profile",getProfile)

router.get("/logout",logout)

export default router