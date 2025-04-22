import bcrypt from "bcryptjs";
import { generateToken } from "../Lib/generateToken.js";
import { User } from "../Models/userModel.js";
import { TryCatch } from "../Utils/TryCatch.js"

export const signup = TryCatch(async (req, res) => {

    const { name, email, password,role } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }


    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists with this email" });
    }
    
    let userRole = "user";

    if (role === "admin") {
        userRole = "admin";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role:userRole
    });
    generateToken(res, user._id);

    const userWithoutPassword = { ...user._doc, password: undefined }

    return res.status(201).json({ userWithoutPassword, message: "User Registered successfully" });

});

export const login = TryCatch(async (req, res) => {

        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const comparePassword =  await bcrypt.compare(password,user.password);
        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(res,user._id);
        const userWithoutPassword = {...user._doc,password:undefined};
        
        return res.status(200).json({userWithoutPassword,message:`Welcome back, ${user.name}! You’ve successfully logged in.`});
});

export const logout = TryCatch(async (req, res) => {
    res.cookie("token","",{
        maxAge:0,
        httpOnly:true,
        sameSite:"strict"
    });

    return res.status(200).json({message:`You’ve been logged out. See you soon!`});

});


export const getProfile = TryCatch(async (req, res) => {
  

    // const user = req.user;
    const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    const userWithoutPassword = { ...user._doc, password: undefined };
    return res.status(200).json({userWithoutPassword});
});

