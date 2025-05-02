import express from 'express'
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
const AdminRouter = express.Router();

AdminRouter.get('/', (req, res) => {
  res.send('Trang dashboard')
})
AdminRouter.use('/categories', categoryRoutes)
AdminRouter.use('/products', productRoutes)

export default AdminRouter