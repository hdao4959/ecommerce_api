import express from 'express'
import categoryRoutes from './categoryRoutes.js';
const AdminRouter = express.Router();

AdminRouter.get('/', (req, res) => {
  res.send('Trang dashboard')
} )
AdminRouter.use('/', categoryRoutes)

export default AdminRouter