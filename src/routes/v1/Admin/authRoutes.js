import express from 'express'
import authController from '../../../controllers/Admin/authController.js'

const authRoutes = express.Router()
authRoutes.post('/loginAdmin', authController.loginWithEmail)
export default authRoutes