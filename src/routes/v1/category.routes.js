import express from "express"
import CategoryController from "../../controllers/category.controller.js";
import validateBody from "../../middlewares/validateBody.js";

const CategoryRoutes = express.Router();

CategoryRoutes.post('/create',  CategoryController.create)
CategoryRoutes.get('/', CategoryController.getAll)

export default CategoryRoutes