import jwt from "jsonwebtoken"
import { cookieConfig } from "../Constant/constant.js";

export const generateToken = (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
     res.cookie("token", token, cookieConfig);
}