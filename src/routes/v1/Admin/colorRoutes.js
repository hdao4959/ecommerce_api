import express from 'express';
import colorController from '../../../controllers/colorController.js';
import validateBody from '../../../middlewares/validateBody.js';
import colorValidate from '../../../validators/colorValidate.js';
import colorService from '../../../services/colorService.js';

const colorRoutes = express.Router();

colorRoutes.get('/', colorController.getAll);
colorRoutes.post('/', validateBody(colorValidate), colorController.create);
colorRoutes.delete('/:id', colorController.destroy);
export default colorRoutes