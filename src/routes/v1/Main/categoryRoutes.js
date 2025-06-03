import express from "express"
import validateBody from "../../../middlewares/validateBody.js";
import categoryValidate from "../../../validators/categoryValidate.js";
import categoryController from "../../../controllers/Admin/categoryController.js";

const categoryRoutes = express.Router();

categoryRoutes.get('/', categoryController.getAll)
categoryRoutes.post('/', validateBody(categoryValidate), categoryController.create)
categoryRoutes.put('/:id',validateBody(categoryValidate), categoryController.update)
export default categoryRoutes