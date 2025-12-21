import express from "express";
import dotenv from "dotenv";
import {neon} from "@neondatabase/serverless";
import blogRoutes from "./routes/blog_route.js";

const app = express();
dotenv.config();

import {v2 as cloudinary} from "cloudinary";

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

export const sql = neon(process.env.DB_URL as string);

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS blogs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blogcontent TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`;

        await sql`
            CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            userid VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`;

        await sql`
            CREATE TABLE IF NOT EXISTS savedblogs (
            id SERIAL PRIMARY KEY,
            userid VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`;

        console.log("Database initialized successfully :)");
    } catch(error) {
        console.log("Error initDb", error);
    }
}

app.use("/api/blog", blogRoutes);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
