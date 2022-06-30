import { Router } from "express";
import { getAllCategories } from "../controllers/categories.controllers";

const categoriesRouter = Router();
categoriesRouter.route("/").get(getAllCategories);

export default categoriesRouter;
