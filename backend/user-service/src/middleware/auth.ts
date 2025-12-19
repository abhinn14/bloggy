import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/user.js";

export const isAuth = async (req:Request,res:Response,next:NextFunction):Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({message:"No auth header."});
            return;
        }
        
        const token = authHeader.split(" ")[1];
        const decodeValue = jwt.verify(token,process.env.JWT_KEY as string) as JwtPayload;
         

    } catch(error) {
        console.log("JWT error => ",error);
        res.status(401).json({message:"JWT error"});
    }
}