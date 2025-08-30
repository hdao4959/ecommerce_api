import express from 'express'
import authController from '../../../controllers/Shipper/authController.js'
import validateBody from '../../../middlewares/validateBody.js'
import shipperValidate from '../../../validators/shipperValidate.js'
const authRoutes = express.Router()
authRoutes.post('/login',validateBody(shipperValidate.login), authController.login)
export default authRoutes