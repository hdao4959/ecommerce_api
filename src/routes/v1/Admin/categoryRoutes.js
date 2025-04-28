import express from 'express'
import categoryController from '../../../controllers/categoryController.js';
import validateBody from '../../../middlewares/validateBody.js';
import categoryValidate from '../../../validators/categoryValidate.js';

const categoryRoutes = express.Router();
categoryRoutes.get('/categories', categoryController.getAll);
categoryRoutes.get('/categories/:id', categoryController.getChildrentCategory);
categoryRoutes.post('/categories', validateBody(categoryValidate), categoryController.create);
categoryRoutes.put('/categories/:id', validateBody(categoryValidate), categoryController.update);
categoryRoutes.delete('/categories/:id', categoryController.destroy);
export default categoryRoutes