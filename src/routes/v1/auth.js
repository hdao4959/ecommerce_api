import express from 'express'
import authController from '../../controllers/authController.js'
const AuthRoutes = express.Router()

AuthRoutes.post('/google', authController.loginWithGoogle)

export default AuthRoutes