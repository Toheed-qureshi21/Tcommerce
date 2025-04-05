import jwt from "jsonwebtoken"
import { User } from "../Models/userModel.js";
import { TryCatch } from "../Utils/TryCatch.js";

export const authenticate = TryCatch(async (req, res, next) => {
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please log in first" });
    }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id || decoded._id).select("-password");
       

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        req.user = user;
        next(); 
    }) 




export const authorized = TryCatch(async(req, res, next) => {
    if(req.user && req.user.role === "admin"){
        return next();
    }
    return res.status(401).json({message:"Access Denied only admin can access"});
});