import express from 'express'
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import productService from '../../../services/productService.js';
import { successResponse } from '../../../utils/response.js';

const mainRoutes = express.Router();

mainRoutes.use('/categories', categoryRoutes)
mainRoutes.use('/products', productRoutes)
mainRoutes.get('/', async (req, res, next) => {
  try {
    const products = await productService.getAll();
    return successResponse(res, {data: result}, 200)
  } catch (error) {
    next(error)
  }
})
export default mainRoutes