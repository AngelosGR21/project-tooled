import { Request, Response, NextFunction } from "express"
import { LoginUser, CreatingUser } from "../utils/user.types";

//models
import { verifyUser, insertUser } from "../models/users.models";

export const loginUser = (
    req: Request<{}, {}, LoginUser>,
    res: Response<{ message: string }>,
    next: NextFunction) => {

    verifyUser(req.body).then((token) => {
        res.setHeader("X-Application-Token", token);
        res.status(200).json({ message: "Login successful!" });
    }).catch(next);
}


export const postUser = (
    req: Request<{}, {}, CreatingUser>,
    res: Response,
    next: NextFunction) => {

    insertUser(req.body).then((token) => {
        res.setHeader("X-Application-Token", token);
        res.status(201).json({ message: "User created!" })
    }).catch(next)
}