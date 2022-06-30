import { Router } from "express";
import { loginUser } from "../controllers/users.controllers";


const usersRouter = Router();

usersRouter.route("/login")
    .post(loginUser)


export default usersRouter;