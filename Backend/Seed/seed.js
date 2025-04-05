import dotenv from "dotenv"
import { Product } from "../Models/productModel.js";

import { connectToDB } from "../Lib/connectDB.js";

dotenv.config();
connectToDB();

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
  
    console.log('✅ Products seeded deleted!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
