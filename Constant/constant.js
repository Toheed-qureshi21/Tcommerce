 import { config } from "dotenv"
 
 config();
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "None",
  maxAge: 24 * 60 * 60 * 1000
};
