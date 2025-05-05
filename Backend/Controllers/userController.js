import fs from "fs/promises"
import path from "path"
import bcrypt from "bcryptjs";
import ejs from "ejs"
import mjml2html from "mjml";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";

import { generateToken } from "../Lib/generateToken.js";
import { User } from "../Models/userModel.js";
import { TryCatch } from "../Utils/TryCatch.js"
import { createVerifyEmailLink, findVerificationEmailToken, generateResetPasswordLink, generateVerificationToken, getPasswordResetData, getUserWithOauthId, updatePassword, verifyUserEmailAndUpdate } from "../Services/user.service.js";
import { sendEmail } from "../Lib/nodemailer.js";
import { ForgotPassword } from "../Models/forgotPasswordModel.js";
import { VerifyEmail } from "../Models/emailVerifyModel.js";
import { google } from "../Lib/google.js";
import { OAuthAccount } from "../Models/oauthAccountModel.js";
import { github } from "../Lib/github.js";

export const signup = TryCatch(async (req, res) => {

    const { name, email, password, role } = req.body

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
        role: userRole
    });
    generateToken(res, user._id);

    const userWithoutPassword = { ...user._doc, password: undefined }

    return res.status(201).json({ userWithoutPassword, message: "User Registered successfully" });

});

export const login = TryCatch(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    generateToken(res, user._id);
    const userWithoutPassword = { ...user._doc, password: undefined };

    return res.status(200).json({ userWithoutPassword, message: `Welcome back, ${user.name}! You’ve successfully logged in.` });
});

export const logout = TryCatch(async (req, res) => {
    const userId = req.user._id;

    // Check if user logged in with Google
    const googleOAuthAccount = await OAuthAccount.findOne({
        userId: userId,
        provider: "google",
    });
    const githubOAuthAccount = await OAuthAccount.findOne({
        userId: userId,
        provider: "github",
    });
    // Clear cookies
    res.clearCookie("token", { path: "/" });
    res.clearCookie("google_oauth_code_verifier", { path: "/" });
    res.clearCookie("google_oauth_state", { path: "/" });
    res.clearCookie("google_oauth_token", { path: "/" });
    if (googleOAuthAccount) {
        await OAuthAccount.deleteOne({ _id: googleOAuthAccount._id });
        return res.redirect("https://accounts.google.com/Logout");
    }
     if(githubOAuthAccount){
        await OAuthAccount.deleteOne({ _id: githubOAuthAccount._id });
    }  
    return res.redirect(`${process.env.CLIENT_URL}/login`);

});


export const getProfile = TryCatch(async (req, res) => {


    // const user = req.user;
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    const userWithoutPassword = { ...user._doc, password: undefined };
    return res.status(200).json({ userWithoutPassword });
});

export const toChangeProfile = TryCatch(async (req, res) => {
    const { name, email, role } = req.body.userDetails;

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    user.password = undefined
    const userWithoutPassword = user;
    return res.status(200).json({ userWithoutPassword, message: "Profile updated successfully" });
});


export const forgotPassword = TryCatch(async (req, res) => {
    const { email } = req.body;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }
    // ! Step -1 --> Generates random Token of 64 characters
    // ! Step -2 --> Converts that random token into hash
    // ! Step -3 --> Clear all previous token_hash of that user
    // ! Step -4 --> Insert the token_hash into ForgotPassword.model
    // ! Step -5 --> Returns link
    const resetPasswordLink = await generateResetPasswordLink(user._id);

    // ! mjml template to send email to user
    const mjmlTemplate = await fs.readFile(path.join(import.meta.dirname, "../Emails/forgot-password.mjml"), "utf-8");
    const filledMjmlTemplate = ejs.render(mjmlTemplate, {
        name: user.name,
        link: resetPasswordLink
    });
    const htmlOutputOfMjml = mjml2html(filledMjmlTemplate).html;
    const result = await sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: htmlOutputOfMjml
    });

    if (!result.success) {
        return res.status(500).json({ message: "Email failed", error: result.error });
    }

    res.status(200).json({ message: "Email sent successfully" });

});
export const getPasswordPage = TryCatch(async (req, res) => {
        const {token} = req.params;
        const passwordResetData = await getPasswordResetData(token);
        if (!passwordResetData) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        return res.status(200).json({ success: true, token });
});
export const postResetPassword = TryCatch(async (req, res) => {
        const {newPassword,confirmPassword} = req.body;
        if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Both password fields are required" });
        }
        const {token} = req.params;
        const passwordResetData = await getPasswordResetData(token);
        const userId = passwordResetData?.userId;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        const salt = 12;
        await ForgotPassword.deleteMany({userId});
        await updatePassword(userId,newPassword,salt);
        return res.status(201).json({ success: true, message: "Password reset successfully" });

})

// Email verification functions
export const verifyEmailToken = TryCatch(async (req, res) => {

    const { token } = req.body;


    const tokenOtp = await findVerificationEmailToken(token);
    if (!tokenOtp) {
        return res.status(400).json({ error: "Invalid token" });
    }
    await verifyUserEmailAndUpdate(tokenOtp)

    return res.status(200).json({ message: "Email verified successfully" });

})
export const sendVerificationLink = TryCatch(async (req, res) => {
        if (!req.user) {
            return res.redirect("/login");
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const randomToken = generateVerificationToken();
        await VerifyEmail.deleteMany({ userId: user._id });
        await VerifyEmail.create({
            userId: user._id,
            token: randomToken
        });
        // ! Creating url with random token

        const verifyEmailLink = createVerifyEmailLink(user.email, randomToken);

        // ! Using mjml email template instead of html
        const mjmlTemplate = await fs.readFile(path.join(import.meta.dirname, "../Emails/verify-email.mjml"), "utf-8");
        // ! Step 2:- To replace placeholder in .mjml file with actual values of links and randomToken
        const filledMjmlTemplate = ejs.render(mjmlTemplate, {
            code: randomToken,
            link: verifyEmailLink
        })

        //! Step:-3 To convert mjml file to html file
        const htmlOutputOfMjmlFile = mjml2html(filledMjmlTemplate).html;


        //! Now we have to send email in user gmail using resend instead of nodemailer
        // ! So this sendEmail function of nodemailer get replaced by sendEmail function of resend
        // ! Full file of nodemailer is in Libs/nodemailer.js gets commented

        sendEmail({
            to: user.email,
            subject: "Verify your email",
            html: htmlOutputOfMjmlFile
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        });
        return res.status(200).json({ message: "Email sent successfully" });
})

export const getGoogleConsentPage = TryCatch(async (req,res) => {

    // To create authorization url
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const scopes = ["openid", "profile","email"]
    const redirectUri = process.env.NODE_ENV === 'production' 
    ? 'https://tcommerce.onrender.com/api/auth/google/callback'  // Production
    : 'http://localhost:3000/api/auth/google/callback';
    const url = google.createAuthorizationURL(state,codeVerifier,scopes,{
        prompt: "consent select_account",
        access_type: "offline",
        include_granted_scopes: false,
        redirect_uri: redirectUri,
    });
    const cookieConfig = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge:100*60*60*1000,
    }
    res.cookie("google_oauth_state",state,cookieConfig)
    res.cookie("google_oauth_code_verifier",codeVerifier,cookieConfig)

    return res.redirect(url.toString());
}
)

export const getGoogleCallback = TryCatch(async (req,res) => {

        const { state, code } = req.query;
        const { google_oauth_state: storedStateInCookie, google_oauth_code_verifier: storedCodeVerifier } = req.cookies;
        
        // Validate the state and code
        if (!state || !code || !storedStateInCookie || !storedCodeVerifier || state !== storedStateInCookie) {
           return res.status(400).json({ error: "Invalid state or code" });
        }
    
        let tokens;
        try {
            // Validate the authorization code
            tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
            const claims = decodeIdToken(tokens.idToken());
            
    
            const { sub: googleUserId, email, name } = claims;
    
            // 1. Check if OAuthAccount exists for the Google user
            let oauthAccount = await OAuthAccount.findOne({
                provider: "google",
                providerAccountId: googleUserId
            });
            let user;
    
            // 2. If OAuthAccount does not exist, create a new one
            if (!oauthAccount) {
                // Check if a user already exists with this email
                 user = await User.findOne({ email }).select("-password");
    
                if (!user) {
                    // If no user exists with this email, create a new user
                    user = await User.create({ name, email, isEmail_Verified: true });
                }
    
                // Create a new OAuthAccount and link it to the user
                oauthAccount = await OAuthAccount.create({
                    userId: user._id,
                    provider: "google",
                    providerAccountId: googleUserId
                });
            } else {
                // If OAuthAccount exists, retrieve the linked user
                user = await User.findById(oauthAccount.userId).select("-password");
            }
    
            // Generate the token and redirect the user to the home page
            generateToken(res, oauthAccount.userId || user._id);
            res.clearCookie("google_oauth_state");
            res.clearCookie("google_oauth_code_verifier");
    
            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            return res.status(500).json({ message:error.message });
        }

});

export const getGithubConsentPage = TryCatch(async (req,res) => {
     // Generate state for CSRF protection
    const state = generateState();
    const url = github.createAuthorizationURL(state, [
        "user:email",
    ]);
    const cookieConfig = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge:100*60*60*1000,
    }
    res.cookie("github_oauth_state",state,cookieConfig)
    return res.redirect(url.toString());
});

export const getGithubCallback = TryCatch(async (req,res) => {
        const { state, code } = req.query;
        const {github_oauth_state: storedStateInCookie} = req.cookies;
        if (!state || !code || !storedStateInCookie || state !== storedStateInCookie) {
            return res.status(400).json({ message: "Invalid state or code" });
        }
        let tokens;
        try {
            tokens = await github.validateAuthorizationCode(code);
        } catch (error) {
            return res.status(400).json({ message: "Something went wrong while validating the authorization code" });
        }
        const githubResponse = await fetch("https://api.github.com/user",{
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`
            }
        });
        const {id:githubUserId,name} = await githubResponse.json();

        const githubEmailResponse = await fetch("https://api.github.com/user/emails",{
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`
            }
        });
        if (!githubEmailResponse.ok) {
            const errorData = await githubEmailResponse.json();
            return res.status(400).json({ message: "Error fetching emails from GitHub" });
        }
        
        const emails = await githubEmailResponse.json();
        
        const email = emails?.filter((e)=>e.primary)[0].email;
        if (!email) {
            return res.status(400).json({ message: "No email found" });
            
        }
        // Condition : 1 --> IF USer already exists with github oauth account as well as by normal registration
        let user = await getUserWithOauthId({email,"provider":"github"});
        
        // Condition 2 --> if user exists with same email but not linked with google oauth account
        if(user&&!user.providerAccountId){
            await OAuthAccount.create({
                userId: user.id,
                provider: "github",
                providerAccountId: githubUserId
            });
        }
        // Condition 3 :--> If user does not exists 
        if(!user){
            await User.create({ name, email, isEmail_Verified: true });
            user = await User.findOne({ email }).select("-password");
            await OAuthAccount.create({
                userId: user.id,
                provider: "github",
                providerAccountId: githubUserId
            });
        }
        generateToken(res, user.id);
        res.clearCookie("github_oauth_state");
        return res.redirect(process.env.CLIENT_URL);    
})