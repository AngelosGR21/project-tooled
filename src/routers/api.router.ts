import { Router } from "express";
import getApi from "../controllers/api.controllers";

const apiRouter = Router();
apiRouter.route("/").get(getApi);

export default apiRouter;
