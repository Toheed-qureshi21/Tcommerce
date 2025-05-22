import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            dbName:"Ecommerce",
        });
        console.log("MONGODB CONNECTED");
    } catch (error) {
        console.log(error);
    }
}