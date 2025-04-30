import crypto from "crypto"
import { ForgotPassword } from "../Models/forgotPasswordModel.js";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../Models/userModel.js";

config();
export const generateResetPasswordLink =async (userId) => {
    const random_token = crypto.randomBytes(32).toString("hex");
    const token_hash = crypto.createHash("sha256").update(random_token).digest("hex");
    await ForgotPassword.deleteMany({userId});
    await ForgotPassword.insertOne({
        userId,
        token_hash,
        createdAt:Date.now()
    });
    console.log("Token Hash Inserted:", { userId, token_hash });
    return `${process.env.CLIENT_URL}/reset-password/${random_token}`;


}
export const getPasswordResetData = async (token) => {
    const token_hash = crypto.createHash("sha256").update(token).digest("hex");
    const forgotPasswordData = await ForgotPassword.findOne({token_hash});
    return forgotPasswordData;
}

export const updatePassword = async(userId,newPassword,salt)=>{
        const newHashPassword = await bcrypt.hash(newPassword,salt);
        await User.updateOne(
            {_id:userId},
            {$set:{password:newHashPassword}}
        );
        
}