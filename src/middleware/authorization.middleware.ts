import e, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
    path: `${__dirname}/../../.env.keys`
});


export const locationAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (token) {
        jwt.verify(token, String(process.env.TEST_KEY), (err, decoded) => {
            if (err) {
                res.locals.tokenError = { status: 410, message: "Token expired or is invalid, login again" }
                next();
            } else {
                res.locals.user = decoded;
                res.locals.updatedSortBy = ["price", "rating", "location"];
                next();
            }
        });
    } else {
        next()
    }

}

export const postAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {

        jwt.verify(token, String(process.env.TEST_KEY), (err, decoded) => {
            if (err) {
                next({ status: 410, message: "Token expired or is invalid, login again" })
            }

            res.locals.user = decoded;

            next()
        });
    } else {
        next({ status: 401, message: "you are not logged in" })
    }
}