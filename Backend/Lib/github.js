import { GitHub } from "arctic";
import { config } from "dotenv";

config();
export const github = new GitHub(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET,process.env.GITHUB_REDIRECT_URI);