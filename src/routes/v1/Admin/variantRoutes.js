import express from 'express';
import variantController from '../../../controllers/Admin/variantController.js';
import validateBody from '../../../middlewares/validateBody.js';
import variantValidate from '../../../validators/variantValidate.js';
import upload from '../../../middlewares/uploadImage.js';
const variantRoutes = express.Router();

variantRoutes.get('/', variantController.getAll);
variantRoutes.post('/', 
  upload.array('images', 50),
   variantController.create);
variantRoutes.get('/:id', variantController.detail);
variantRoutes.delete('/:id', variantController.destroy);
variantRoutes.put('/:id',
   upload.array('images', 50),
    variantController.update)

export default variantRoutes