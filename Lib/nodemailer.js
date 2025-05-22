import nodemailer from "nodemailer";
import { config } from "dotenv";
config();
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587, // Use 465 for SSL or 2525 if 587 is blocked
    secure: false, // Set to true if using port 465
    auth: {
      user: process.env.BREVO_SMTP_LOGIN, // Your Brevo SMTP login (email address)
      pass: process.env.BREVO_SMTP_MASTER_PASSWORD, // Your Brevo SMTP password (API key)
    },
  });
  export const sendEmail = async ({ to, subject, html }) => {
  
    try {
      const info = await transporter.sendMail({
        from: `"TCOMMERCE" <${process.env.BREVO_SMTP_EMAIL}>`,
        to,
        subject,
        html,
      });
      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  };