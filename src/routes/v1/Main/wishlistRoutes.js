import express from 'express'
import wishlistController from '../../../controllers/Client/wishlistController.js'
import { verifyToken } from '../../../middlewares/verifyToken.js';
const wishlistRoutes = express.Router()

wishlistRoutes.use(verifyToken)
wishlistRoutes.post('/', wishlistController.create);

export default wishlistRoutes