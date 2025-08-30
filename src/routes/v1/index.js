import express from 'express'
import AdminRouter from './Admin/index.js'
import MainRoutes from './Main/index.js'
import LocationRoutes from './locationRoutes.js'
import ShipperRoutes from './Shipper/index.js'

const Router_V1 = express.Router()
Router_V1.use('/', MainRoutes)
Router_V1.use('/admin', AdminRouter)
Router_V1.use('/shipper', ShipperRoutes)
Router_V1.use('/location', LocationRoutes )

export default Router_V1