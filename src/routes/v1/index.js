import express from 'express'
import categoryRoutes from "./categoryRoutes.js"
import ProductRoutes from './productRoutes.js'
import AdminRouter from './Admin/index.js'
const Router_V1 = express.Router()

Router_V1.use('/categories', categoryRoutes)
Router_V1.use('/products', ProductRoutes)
Router_V1.use('/admin', AdminRouter)
Router_V1.get('/', (req, res)=> {
  res.send('Trang home')
})
export default Router_V1