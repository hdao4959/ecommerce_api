import express from "express"
import CategoryController from "../../controllers/category.controller.js";
import validateBody from "../../middlewares/validateBody.js";
import CategorySchema from "../../validators.js/category.validate.js";

const CategoryRoutes = express.Router();

CategoryRoutes.get('/', CategoryController.getAll)
CategoryRoutes.post('/', 
  validateBody(CategorySchema),
    CategoryController.create)
CategoryRoutes.put('/:id',validateBody(CategorySchema), CategoryController.update)
CategoryRoutes.delete('/:id', CategoryController.destroy);
export default CategoryRoutes