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
productRoutes.put('/:id', upload.any(), productController.update);
productRoutes.put('/:id/updateVariants', upload.any(), productController.updateVariants);
productRoutes.get('/:id', productController.detail);
productRoutes.delete('/:id', productController.destroy);
export default productRoutes 