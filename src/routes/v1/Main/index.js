import express from 'express'
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import mainController from '../../../controllers/Client/mainController.js';
import productController from '../../../controllers/Client/productController.js';

const MainRoutes = express.Router();

MainRoutes.use('/categories', categoryRoutes)
MainRoutes.use('/products', productRoutes)

MainRoutes.get('/', mainController.homePage)
MainRoutes.post('/cart', mainController.cartPage);


export default MainRoutes