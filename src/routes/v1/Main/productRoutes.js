import express from 'express'
import productController from '../../../controllers/productController.js'
const productRoutes = express.Router();

productRoutes.get('/', productController.getAll)
// productRoutes.get('/:id', productController.)

export default productRoutes