import type {Request, Response} from "express";
import User from "../models/user_model.js";
import jwt from "jsonwebtoken";
import type { AuthReq } from "../middleware/user_auth.js";
import getBuffer from "../utils/dataURI.js"
// type tells TS -> “This import is only for type checking, don’t emit it in JS”
import { v2 as cloudinary } from "cloudinary";

export const login = async (req:Request, res:Response) => {
    try {
        const {email, name, image} = req.body;
        let user = await User.findOne({email});
        if(!user) user = await User.create({name, email, image});
        const token = jwt.sign({userId: user._id}, process.env.JWT_KEY as string, {expiresIn:"5d"});


        res.status(200).json({message: "Login Successful!", token, user});
    } catch (error:any) {
        res.status(500).json({message: error.message});
    }
};


export const myProfile = async (req:AuthReq, res:Response) => {
    try {
        if(!req.user) return res.status(401).json({message: "Not authenticated"});
        const user = await User.findById(req.user._id);
        if(!user) {
            res.status(401).json({message: "User not found"});
            return;
        }
        res.json(user);
    } catch(error:any) {
        res.status(500).json({message:error.message});
    }
}


export const getUserProfile = async (req:Request, res:Response) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
          res.status(404).json({message: "No user with this id"});
          return;
        }
        res.json(user);
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
};

export const updateUser = async (req: AuthReq, res:Response) => {
    try {
        if(!req.user) return res.status(401).json({ message: "Not authenticated" });
        const {name, linkedin, bio} = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {name, linkedin, bio},
            {new: true}
        );
        if(!user) {
         return res.status(404).json({message: "User not found"});
        }
        res.json({message: "User Updated", user});
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
    
};

export const updateProfilePic = async (req: AuthReq, res: Response) => {
    try {
        if(!req.user) return res.status(401).json({ message: "Not authenticated" });
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

        const cloud = await cloudinary.uploader.upload(fileBuffer.content, {folder: "blogs"});
        const user = await User.findByIdAndUpdate(
          req.user._id,
          {image: cloud.secure_url},
          {new: true}
        );
        res.json({message: "User Profile pic updated", user});
    } catch(error:any) {
        res.status(500).json({message: error.message});
    }
    
}
