import express from 'express'
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import variantRoutes from './variantRoutes.js';
import colorRoutes from './colorRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRoutes.js';
import specificationRoutes from './specificationRoutes.js';
import AuthRoutes from './authRoutes.js';
import { verifyToken } from '../../../middlewares/verifyToken.js';

const AdminRouter = express.Router();
AdminRouter.use('/auth', AuthRoutes)

AdminRouter.use(verifyToken)

AdminRouter.get('/', (req, res) => {
  res.send('Trang dashboard')
})
AdminRouter.use('/categories', categoryRoutes)
AdminRouter.use('/products', productRoutes)
AdminRouter.use('/variants', variantRoutes)
AdminRouter.use('/colors', colorRoutes)
AdminRouter.use('/orders', orderRoutes)
AdminRouter.use('/users', userRoutes)
AdminRouter.use('/specifications/', specificationRoutes)
export default AdminRouter