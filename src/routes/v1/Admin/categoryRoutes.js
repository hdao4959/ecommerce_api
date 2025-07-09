import express from 'express'
import categoryController from '../../../controllers/Admin/categoryController.js';
import validateBody from '../../../middlewares/validateBody.js';
import categoryValidate from '../../../validators/categoryValidate.js';

const categoryRoutes = express.Router();
categoryRoutes.get('/', categoryController.getAll);
categoryRoutes.get('/:id', categoryController.getDetail);
categoryRoutes.get('/:id/children', categoryController.getChildrenCategory);
categoryRoutes.get('/products/:id', categoryController.productsOfCategory);
categoryRoutes.post('/', validateBody(categoryValidate), categoryController.create);
categoryRoutes.put('/:id', validateBody(categoryValidate), categoryController.update);
categoryRoutes.delete('/:id', categoryController.destroy);
export default categoryRoutes