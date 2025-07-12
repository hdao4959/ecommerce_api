import express from "express"
import validateBody from "../../../middlewares/validateBody.js";
import categoryValidate from "../../../validators/categoryValidate.js";
import categoryController from "../../../controllers/Client/categoryController.js";

const categoryRoutes = express.Router();

categoryRoutes.get('/', categoryController.getAllActive);
categoryRoutes.get('/:id', categoryController.getProductsOfCategory)
export default categoryRoutes