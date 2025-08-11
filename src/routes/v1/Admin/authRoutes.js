import express from 'express'
import authController from '../../../controllers/Admin/authController.js'

const AuthRoutes = express.Router()
AuthRoutes.post('/loginAdmin', authController.loginWithEmail)
export default AuthRoutes