import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI as string,{dbName:"Users"});
    console.log("MONGOdb connected :)");
};

app.use(express.json());

connectDB();

app.use("/api/user",userRoutes);

app.listen(PORT,()=>{console.log(`Server running on http://localhost:${PORT}`);});