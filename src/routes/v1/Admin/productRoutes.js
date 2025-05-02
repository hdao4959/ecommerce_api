import express from 'express'
import productController from '../../../controllers/productController.js';
import validateBody from '../../../middlewares/validateBody.js';
import ProductValidate from '../../../validators/productValidate.js';

const productRoutes = express.Router();
productRoutes.get('/', productController.getAll);
productRoutes.post('/', validateBody(ProductValidate), productController.create);

export default productRoutes 