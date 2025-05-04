import express from 'express';
import colorController from '../../../controllers/colorController.js';
import validateBody from '../../../middlewares/validateBody.js';
import colorValidate from '../../../validators/colorValidate.js';

const colorRoutes = express.Router();

colorRoutes.get('/', colorController.getAll);
colorRoutes.post('/', validateBody(colorValidate), colorController.create);

export default colorRoutes