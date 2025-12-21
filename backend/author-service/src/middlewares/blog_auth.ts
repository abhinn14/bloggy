import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthReq extends Request {
    user?: {_id: string};
}

export const isAuth = async (req:AuthReq,res:Response,next:NextFunction):Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({message: "No auth header."});
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
            res.status(401).json({message: "Invalid token"});
            return;
        }

        req.user = {_id: decoded.userId};

        next();
    } catch(error) {
        console.log("JWT verify error => ", error);
        res.status(401).json({message: "JWT verify error"});
    }
}

    