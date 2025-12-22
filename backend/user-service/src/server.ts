import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import userRoutes from "./routes/user_route.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

app.use(cors());
const {
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

if(!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Missing Cloudinary environment variables");
}

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT;

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI as string, {dbName:"Users"});
    console.log("MONGOdb connected :)");
};

app.use(express.json());

connectDB();

app.use("/api/user",userRoutes);

app.listen(PORT, ()=>{console.log(`Server running on http://localhost:${PORT}`);});

