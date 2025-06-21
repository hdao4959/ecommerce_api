import express from 'express'
import userController from '../../../controllers/Admin/userController.js';
const userRoutes = express.Router();

userRoutes.get('/', userController.getAll);

export default userRoutes