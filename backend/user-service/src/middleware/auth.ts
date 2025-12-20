import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { IUser } from "../models/user.js";

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
        const decodeValue = jwt.verify(token,JWT_KEY) as JwtPayload;
        if(!decodeValue || !decodeValue.user) {
            res.status(401).json({message:"Invalid token"});
            return;
        }

        req.user = decodeValue.user;
        next();
    } catch(error) {
        console.log("JWT verify error => ",error);
        res.status(401).json({message:"JWT verify error"});
    }
}

