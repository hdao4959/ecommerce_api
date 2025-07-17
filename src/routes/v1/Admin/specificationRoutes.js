import express from 'express';
import specificationController from '../../../controllers/Admin/specificationController.js';
import validateBody from '../../../middlewares/validateBody.js';
import specificationValidate from '../../../validators/specificationValidate.js';

const specificationRoutes = express.Router();

specificationRoutes.get('/', specificationController.getAll)
specificationRoutes.post('/', validateBody(specificationValidate), specificationController.create)

export default specificationRoutes