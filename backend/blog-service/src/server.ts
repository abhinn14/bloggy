import express from "express";
import dotenv from "dotenv";
import {neon} from "@neondatabase/serverless";
import blogRoutes from "./routes/blog_route.js"
import { createClient } from "redis";
import { startCacheConsumer } from "./utils/consumer.js";
import cors from "cors";


dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
startCacheConsumer();

export const redisClient = createClient({url:process.env.REDIS_URL as string});
redisClient.connect().then(()=>console.log("Connected to Redis :)")).catch(console.error);

export const sql = neon(process.env.DB_URL as string);

app.use("/api/blog", blogRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})