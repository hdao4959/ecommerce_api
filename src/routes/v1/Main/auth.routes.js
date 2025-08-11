import express from 'express'
import authController from '../../../controllers/Client/authController.js'
import loginGoogleValidate from '../../../validators/auth/loginGoogleValidate.js'
import validateBody from '../../../middlewares/validateBody.js'
const AuthRoutes = express.Router()

AuthRoutes.post('/google', validateBody(loginGoogleValidate), authController.loginWithGoogle)
AuthRoutes.post('/account', authController.getAccountByGoogleId)
export default AuthRoutes