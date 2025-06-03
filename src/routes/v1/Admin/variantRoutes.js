import express from 'express';
import variantController from '../../../controllers/Admin/variantController.js';
import validateBody from '../../../middlewares/validateBody.js';
import variantValidate from '../../../validators/variantValidate.js';
import upload from '../../../middlewares/uploadImage.js';
const variantRoutes = express.Router();

variantRoutes.get('/', variantController.getAll);
variantRoutes.post('/', 
  // validateBody(variantValidate),
  upload.array('images', 20),
   variantController.create);
variantRoutes.delete('/:id', variantController.destroy);

export default variantRoutes