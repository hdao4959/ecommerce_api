import express from 'express'
import authController from '../../../controllers/Client/authController.js'
import validateBody from '../../../middlewares/validateBody.js'
import userValidate from '../../../validators/userValidate.js'
import { verifyToken } from '../../../middlewares/verifyToken.js'
const AuthRoutes = express.Router()

AuthRoutes.post('/google', validateBody(userValidate.loginGoogleValidate), authController.loginWithGoogle)
AuthRoutes.post('/account', authController.getAccountByGoogleId)
AuthRoutes.post('/register', validateBody(userValidate.register), authController.register)
AuthRoutes.post('/login', authController.login)
AuthRoutes.use(verifyToken)
AuthRoutes.get('/info', authController.getInfoAccount)
export default AuthRoutes