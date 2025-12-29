import cloudinary from "cloudinary";
import type {Response} from "express";
import type {AuthReq} from "../middlewares/author_auth.js";
import {sql} from "../server.js";
import getBuffer from "../utils/dataURI.js";
import { invalidateChacheJob } from "../utils/rabbitMQ.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const createBlog = async (req: AuthReq, res: Response) => {
    try {
        const {title, description, blogcontent, category} = req.body;
        const file = req.file;
        
        if(!file) {
            res.status(400).json({message: "No file to upload"});
            return;
        }
    
        const fileBuffer = getBuffer(file);
        if(!fileBuffer || !fileBuffer.content) {
            res.status(400).json({message: "Failed to generate buffer"});
            return;
        }
    
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {folder: "blogs"});
    
        const result =
          await sql`
          INSERT INTO blogs (title, description, image, blogcontent,category, author)
          VALUES (${title}, ${description},${cloud.secure_url},${blogcontent},${category},
          ${req.user?._id}) RETURNING *`;

        await invalidateChacheJob(["blogs:*"]);
        
        res.json({message: "Blog Created", blog: result[0]});
    } catch(error:any) {
        res.status(500).json({message:error.message});
    }
};

export const updateBlog = async (req: AuthReq, res: Response) => {
    try {
        const {id} = req.params;
        const {title, description, blogcontent, category} = req.body;

        const file = req.file;

        const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;
        if(!blog[0]) {
          return res.status(404).json({message: "No blog with this id"});
        }

        if(blog[0].author!==req.user?._id) {
            res.status(401).json({message: "You are not author of this blog"});
            return;
        }

        let imageUrl = blog[0].image;

        if(file) {
            const fileBuffer = getBuffer(file);
            if(!fileBuffer || !fileBuffer.content) {
                res.status(400).json({message: "Failed to generate buffer"});
                return;
            }
            const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {folder: "blogs"});
            imageUrl = cloud.secure_url;
        }

        const updatedBlog = await sql`UPDATE blogs SET
            title = ${title || blog[0].title},
            description = ${description || blog[0].description},
            image= ${imageUrl},
            blogcontent = ${blogcontent || blog[0].blogcontent},
            category = ${category || blog[0].category}

            WHERE id = ${id}
            RETURNING *
            `;

        await invalidateChacheJob(["blogs:*", `blog:${id}`]);

        res.json({message: "Blog Updated", blog: updatedBlog[0]});
    } catch(error:any) {
        res.status(500).json({message:error.message});
    }
};

export const deleteBlog = async (req: AuthReq, res: Response) => {
    try {
        const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;
        if(!blog[0]) {
            return res.status(404).json({message: "No blog with this id"});
        }
    
        if(blog[0].author !== req.user?._id) {
            res.status(401).json({message: "You are not author of this blog"});
            return;
        }
    
        await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
        await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;
        await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;
    
        await invalidateChacheJob(["blogs:*", `blog:${req.params.id}`]);
        
        res.json({message: "Blog Deleted"});
    } catch(error:any) {
        res.status(500).json({message:error.message});
    }
};

export const aiBlogResponse = async (req: AuthReq, res: Response) => {
    try {
        const prompt = ` You will act as a grammar correction engine. I will provide you with blog content 
        in rich HTML format (from Jodit Editor). Do not generate or rewrite the content with new ideas. Only correct 
        grammatical, punctuation, and spelling errors while preserving all HTML tags and formatting. Maintain inline styles, 
        image tags, line breaks, and structural tags exactly as they are. Return the full corrected HTML string as output. `;

        const {blog} = req.body;
        if(!blog) return res.status(404).json({message: "Please provide blog"});
        
        const fullMessage = `${prompt}\n\n${blog}`;
    
        const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = ai.getGenerativeModel({model: "gemini-2.5-flash"});
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{text: fullMessage}],
            },
          ],
        });
    
        const responseText = result.response.text();
    
        const cleanedHtml = responseText
          .replace(/^(html|```html|```)\n?/i, "")
          .replace(/```$/i, "")
          .replace(/\*\*/g, "")
          .replace(/[\r\n]+/g, "")
          .replace(/[*_`~]/g, "")
          .trim();
    
        res.status(200).json({ html: cleanedHtml });
    } catch(error:any) {
        res.status(500).json({message:error.message});
    }
};