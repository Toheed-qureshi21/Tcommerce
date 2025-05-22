import crypto from "crypto"
import { ForgotPassword } from "../Models/forgotPasswordModel.js";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../Models/userModel.js";
import { VerifyEmail } from "../Models/emailVerifyModel.js";
import { OAuthAccount } from "../Models/oauthAccountModel.js";

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

export const generateVerificationToken = (digit = 8) => {
    const min = 10 ** (digit - 1);
    const max = (10 ** digit) - 1;
    return crypto.randomInt(min, max).toString();
}
export const createVerifyEmailLink = (email, token) => {
    const uriEncodedEmail = encodeURIComponent(email);
    return `${process.env.CLIENT_URL}/verify-email-link?email=${uriEncodedEmail}&token=${token}`;
}

// findVerificationEmailToken
export const findVerificationEmailToken = async (token) => {
    const tokenData = await VerifyEmail.findOne({ token })
    if (!tokenData) {
        return null;
    }
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (tokenData.createdAt < twentyFourHoursAgo) {
        return null;
    }
    const userId = tokenData.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
        return null;
    }

    return {
        ...tokenData._doc,
        email:user.email
    };

}
// verifyUserEmailAndUpdate
export const verifyUserEmailAndUpdate = async ({ email, userId }) => {
    const user = await User.findOneAndUpdate({ email }, { isEmail_Verified: true }, { new: true });
    
    await user.save();
    await VerifyEmail.deleteMany({userId});
    return user;
}
export async function getUserWithOauthId({ email, provider }) {
    // First, find the user by email
    const user = await User.findOne({ email });
  
    if (!user) return null;
  
    // Then, find the corresponding OAuth account
    const oauthAccount = await OAuthAccount.findOne({
      userId: user._id,
      provider,
    });
  
    const userInfo = {
      id: user?._id,
      name: user?.name,
      email: user?.email,
      isEmailValid: user?.isEmail_Verified,
      providerAccountId: oauthAccount?.providerAccountId || null,
      provider: oauthAccount?.provider || null,
    };
    return userInfo
  }