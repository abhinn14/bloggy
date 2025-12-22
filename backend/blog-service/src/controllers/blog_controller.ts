// import { AuthenticatedReq } from "";
import {redisClient} from "../server.js";
import {sql} from "../server.js";
import type {Request, Response} from "express";
import axios from "axios";
import type { AuthReq } from "../middlewares/blog_auth.js";

export const getAllBlogs = async (req:Request, res:Response) => {
    try {
        const searchQuery =
            typeof req.query.searchQuery === "string" ? req.query.searchQuery : "";

        const category =
            typeof req.query.category === "string" ? req.query.category : "";

        const cacheKey = `blogs:${searchQuery.toLowerCase()}:${category.toLowerCase()}`;

        const cached = await redisClient.get(cacheKey);

        if(cached) {
            console.log("Fetched from Redis!!");
            res.json(JSON.parse(cached));
            return;
        }

        let blogs;

        if(searchQuery && category) {
            blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%"+searchQuery+"%"}
            OR description ILIKE ${"%"+searchQuery+"%"})
            AND category = ${category} ORDER BY create_at DESC`;
        } else if(searchQuery) {
            blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${"%"+searchQuery+"%"}
            OR description ILIKE ${"%"+searchQuery+"%"}) ORDER BY create_at DESC`;
        } else if(category) {
            blogs = await sql`SELECT * FROM blogs WHERE category=${category} ORDER BY create_at DESC`;
        } else {
            blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC`;
        }

        console.log("Fetched from DB!!");

        await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3600 });

        res.json(blogs);
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
};

export const getSingleBlog = async (req: Request, res: Response) => {
    try {
        const blogid = req.params.id;

        const cacheKey = `blog:${blogid}`;
        const cached = await redisClient.get(cacheKey);

        if(cached) {
            console.log("Serving single blog from Redis cache!!");
            res.json(JSON.parse(cached));
            return;
        }
    
        const blog = await sql`SELECT * FROM blogs WHERE id = ${blogid}`;
        if(!blog[0]) return res.status(404).json({message: "No blog with this id"});
        
        const {data} = await axios.get(`${process.env.USER_SERVICE}/api/user/getuser/${blog[0].author}`);

        const responseData = {blog: blog[0], author: data};
    
        await redisClient.set(cacheKey, JSON.stringify(responseData), {EX: 3600});
    
        res.json(responseData);
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
};

export const addComment = async (req: AuthReq, res: Response) => {
    try {
        if(!req.user) return res.status(401).json({message: "Not authenticated"});

        const {id: blogid} = req.params;
        const {comment} = req.body;

        if(!comment || comment.trim() === "") {
          return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const blog = await sql`SELECT id FROM blogs WHERE id = ${blogid}`;
        if(!blog[0]) return res.status(404).json({ message: "No blog with this id" });

        const {data: user} =
            await axios.get(`${process.env.USER_SERVICE}/api/user/getuser/${req.user._id}`);

        await sql`
          INSERT INTO comments (comment, blogid, userid, username)
          VALUES (${comment}, ${blogid}, ${req.user._id}, ${user.name})
        `;
        res.json({message: "Comment Added"});

    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
};


export const getAllComments = async (req: Request, res:Response) => {
    try {
        const {id} = req.params;

        const comments =await sql`SELECT * FROM comments WHERE blogid = ${id} ORDER BY create_at DESC`;

        res.json(comments);
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
};


export const deleteComment = async (req: AuthReq, res: Response) => {
    try {
        const {commentid} = req.params;

        const comment = await sql`SELECT * FROM comments WHERE id = ${commentid}`;

        console.log(comment);

        if(!comment[0]) return res.status(404).json({message: "No comment"});

        if(comment[0].userid !== req.user?._id) {
            res.status(401).json({message: "You are not owner of this comment"});
            return;
        }

        await sql`DELETE FROM comments WHERE id = ${commentid}`;

        res.json({message: "Comment Deleted"});
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
}


export const saveBlog = async (req: AuthReq, res: Response) => {
    try {
        const { blogid } = req.params;
        const userid = req.user?._id;

        if(!blogid || !userid) {
            res.status(400).json({
              message: "Missing blog id or userid",
            });
            return;
        }
    
        const existing = await sql`SELECT * FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}`;
    
        if(existing.length === 0) {
            await sql`INSERT INTO savedblogs (blogid, userid) VALUES (${blogid}, ${userid})`;
            res.json({message: "Blog Saved"});
            return;
        } else {
            await sql`DELETE FROM savedblogs WHERE userid = ${userid} AND blogid = ${blogid}`;
            res.json({message: "Blog Unsaved"});
            return;
        }
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
};

export const getSavedBlog = async (req: AuthReq, res: Response) => {
    try {
        const blogs =await sql`SELECT * FROM savedblogs WHERE userid = ${req.user?._id}`;
        res.json(blogs);
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
};

