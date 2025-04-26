import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectToDB } from "./Lib/connectDB.js";
import userRouter from "./Routes/userRoutes.js"
import productRoutes from "./Routes/productRoutes.js"
import cartRoutes from "./Routes/cartRoutes.js"
import couponRoutes from "./Routes/couponRoutes.js"
import paymentRoutes from "./Routes/paymentRoutes.js"
import analyticsRoutes from "./Routes/analyticsRoute.js"
import cors from "cors"
import path from "path"
dotenv.config()

connectToDB();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth",userRouter);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupons",couponRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/analytics",analyticsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
app.listen(PORT,()=>console.log(`Server is running at http://localhost:${PORT}`)); 