import express from 'express'
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import mainController from '../../../controllers/mainController.js';

const mainRoutes = express.Router();

mainRoutes.use('/categories', categoryRoutes)
mainRoutes.use('/products', productRoutes)

mainRoutes.get('/', mainController.homePage)

export default mainRoutes