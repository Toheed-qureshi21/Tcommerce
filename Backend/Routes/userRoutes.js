import express from "express"
<<<<<<< HEAD
import { getProfile, login, logout, signup } from "../Controllers/userController.js";
=======
import { login, logout, signup,getProfile } from "../Controllers/userController.js";
>>>>>>> feature/frontend

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
<<<<<<< HEAD
 router.get("/profile",getProfile)
=======
router.get("/profile",getProfile)
>>>>>>> feature/frontend
router.get("/logout",logout)

export default router