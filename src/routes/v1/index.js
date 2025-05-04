import express from 'express'
import AdminRouter from './Admin/index.js'
import mainRoutes from './Main/index.js'

const Router_V1 = express.Router()

Router_V1.use('/admin', AdminRouter)
Router_V1.get('/', mainRoutes)

export default Router_V1