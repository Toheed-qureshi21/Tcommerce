import express from "express"
import { login, logout, signup } from "../Controllers/userController.js";

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
//todo router.get("/profile",profile)
router.get("/logout",logout)

export default router