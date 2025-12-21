import express from "express";
import dotenv from "dotenv";
import {neon} from "@neondatabase/serverless";
import blogRoutes from "./routes/blog_route.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;

const sql = neon(process.env.DB_URL as string);

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
