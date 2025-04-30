import bcrypt from "bcryptjs";
import { generateToken } from "../Lib/generateToken.js";
import { User } from "../Models/userModel.js";
import { TryCatch } from "../Utils/TryCatch.js"
import { createVerifyEmailLink, findVerificationEmailToken, generateResetPasswordLink, generateVerificationToken, getPasswordResetData, updatePassword, verifyUserEmailAndUpdate } from "../Services/user.service.js";
import fs from "fs/promises"
import path from "path"
import mjml2html from "mjml";
import { sendEmail } from "../Lib/nodemailer.js";
import { ForgotPassword } from "../Models/forgotPasswordModel.js";
import ejs from "ejs"
import { VerifyEmail } from "../Models/emailVerifyModel.js";

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
    res.cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict"
    });

    return res.status(200).json({ message: `You’ve been logged out. See you soon!` });

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