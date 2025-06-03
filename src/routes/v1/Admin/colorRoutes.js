import express from 'express';
import colorController from '../../../controllers/Admin/colorController.js';
import validateBody from '../../../middlewares/validateBody.js';
import colorValidate from '../../../validators/colorValidate.js';
import colorService from '../../../services/Admin/colorService.js';

const colorRoutes = express.Router();

colorRoutes.get('/', colorController.getAll);
colorRoutes.post('/', validateBody(colorValidate), colorController.create);
colorRoutes.delete('/:id', colorController.destroy);
export default colorRoutes