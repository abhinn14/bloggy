import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import  User, { type IUser } from "../models/user_model.js";

export interface AuthReq extends Request{
    user?: IUser | null;
}

export const isAuth = async (req:AuthReq,res:Response,next:NextFunction):Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({message:"No auth header."});
            return;
        }
        
        const token = authHeader.split(" ")[1];
        if(!token) {
            res.status(401).json({ message: "Token missing" });
            return;
        }
        const JWT_KEY = process.env.JWT_KEY;
        if(!JWT_KEY) {
          throw new Error("JWT_KEY not defined");
        }
        const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;
        if(!decoded || !decoded.userId) {
            res.status(401).json({message:"Invalid token"});
            return;
        }

        const user = await User.findById(decoded.userId);
        if(!user) {
            res.status(401).json({message: "User not found"});
            return;
        }
        req.user = user; 
        next();
    } catch(error) {
        console.log("JWT verify error => ",error);
        res.status(401).json({message:"JWT verify error"});
    }
}

    