import type {Request, Response} from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const login = async (req:Request,res:Response) => {
    try {
        const {email, name, image} = req.body;
        let user = await User.findOne({email});
        if(!user) {
            user = await User.create({name,email,image});
        }
        const token = jwt.sign({user},process.env.JWT_KEY as string,{expiresIn:"5d"});

        res.status(200).json({message:"Login Successful!",token,user});
    } catch (error:any) {
        res.status(500).json({message:error.message});
    }
};

