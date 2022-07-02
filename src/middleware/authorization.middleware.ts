import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserDetails } from "../types/user.types";

dotenv.config({
    path: `${__dirname}/../../.env.keys`
});


export const locationAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (token) {
        const decodedToken = jwt.verify(token, String(process.env.TEST_KEY)) as UserDetails;
        res.locals.user = decodedToken;
        res.locals.updatedSortBy = ["price", "rating", "location"]
    }

    next()
}