import express from 'express'
import productController from '../../../controllers/Client/productController.js';
const productRoutes = express.Router();

productRoutes.get('/:slug', productController.detail)

export default productRoutes