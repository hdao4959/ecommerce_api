import express from 'express'
import userController from '../../../controllers/Admin/userController.js';
import validateBody from '../../../middlewares/validateBody.js';
import userValidate from '../../../validators/userValidate.js';
const userRoutes = express.Router();

userRoutes.get('/', userController.getAll);
userRoutes.post('/', validateBody(userValidate, {stripUnknown: true}), userController.create);
userRoutes.delete('/:id', userController.destroy)
export default userRoutes