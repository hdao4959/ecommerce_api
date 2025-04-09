import express from 'express'
import CategoryRoutes from "./category.routes.js"
const Router_V1 = express.Router()

Router_V1.use('/categories', CategoryRoutes)

Router_V1.get('/', (req, res)=> {
  res.send('ahahaha')
})
export default Router_V1