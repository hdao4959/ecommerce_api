import express from 'express';
import variantController from '../../../controllers/variantController.js';
import validateBody from '../../../middlewares/validateBody.js';
import variantValidate from '../../../validators/variantValidate.js';
const variantRoutes = express.Router();

variantRoutes.get('/', variantController.getAll);
variantRoutes.post('/', validateBody(variantValidate), variantController.create);
variantRoutes.delete('/:id', variantController.destroy);

export default variantRoutes