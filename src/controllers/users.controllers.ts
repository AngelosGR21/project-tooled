import { Request, Response, NextFunction } from "express"
import { LoginUser } from "../utils/user.types";

//models
import { verifyUser } from "../models/users.models";

export const loginUser = (
    req: Request<{}, {}, LoginUser>,
    res: Response<{ message: string }>,
    next: NextFunction) => {

    verifyUser(req.body).then((token) => {
        res.setHeader("X-Application-Token", token);
        res.status(200).json({ message: "Login successful!" });
    }).catch(next);
}