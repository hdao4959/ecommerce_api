import express from 'express'
import productController from '../../../controllers/Admin/productController.js';
import validateBody from '../../../middlewares/validateBody.js';
import productValidate from '../../../validators/productValidate.js';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage})
const productRoutes = express.Router();
productRoutes.get('/', productController.getAll);
productRoutes.post('/',
   validateBody(productValidate, {stripUnknown: true}),
 productController.create);
productRoutes.put('/:id', validateBody(productValidate), productController.update);
productRoutes.get('/:id', productController.detail);
productRoutes.get('/:id/variants', productController.getVariantsOfProduct);
productRoutes.delete('/:id', productController.destroy);
export default productRoutes 