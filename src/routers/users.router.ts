import { Router } from "express";
import { loginUser, postUser } from "../controllers/users.controllers";


const usersRouter = Router();

usersRouter.route("/")
    .post(postUser)
usersRouter.route("/login")
    .post(loginUser)


export default usersRouter;