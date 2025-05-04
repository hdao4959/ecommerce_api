import express from 'express'
import productController from '../../../controllers/productController.js'
const productRoutes = express.Router();

productRoutes.get('/', productController.getAll)

export default productRoutes