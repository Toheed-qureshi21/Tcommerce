import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectToDB } from "./Lib/connectDB.js";
import userRouter from "./Routes/userRoutes.js"
import productRoutes from "./Routes/productRoutes.js"
import cartRoutes from "./Routes/cartRoutes.js"
import couponRoutes from "./Routes/couponRoutes.js"

dotenv.config()

connectToDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api/auth",userRouter);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupon",couponRoutes);

app.listen(PORT,()=>console.log(`Server is running at http://localhost:${PORT}`));