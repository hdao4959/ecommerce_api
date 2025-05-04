import express from 'express'
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import variantRoutes from './variantRoutes.js';
import colorRoutes from './colorRoutes.js';
const AdminRouter = express.Router();

AdminRouter.get('/', (req, res) => {
  res.send('Trang dashboard')
})

AdminRouter.use('/categories', categoryRoutes)
AdminRouter.use('/products', productRoutes)
AdminRouter.use('/variants', variantRoutes)
AdminRouter.use('/colors', colorRoutes)

export default AdminRouter