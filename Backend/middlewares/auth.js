import jwt from "jsonwebtoken"
import { User } from "../Models/userModel.js";
import { TryCatch } from "../Utils/TryCatch.js";

export const authenticate = TryCatch(async(req, res, next) => {
            const token = req.cookies.token;
            if(!token){
                return res.status(401).json({message:"Unauthorized Please logged in first"});
            }
            const decodedId = jwt.verify(token,process.env.JWT_SECRET);
            if (!decodedId) {
                return res.status(401).json({ message: "Unauthorized Please logged in first" });
            }
        
            const user = await User.findById(decodedId.id).select("-password");
            req.user = user;
            return next();
});

export const authorized = TryCatch(async(req, res, next) => {
    if(req.user && req.user.role === "admin"){
        return next();
    }
    return res.status(401).json({message:"Access Denied only admin can access"});
});