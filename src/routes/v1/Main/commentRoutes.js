import express from 'express'
import commentController from '../../../controllers/Client/commentController.js'
import validateBody from '../../../middlewares/validateBody.js'
import commentValidate from '../../../validators/commentValidate.js'
import { verifyToken } from '../../../middlewares/verifyToken.js'
const commentRoutes = express.Router()

commentRoutes.get('/:variantId', commentController.getListForProduct)
commentRoutes.use(verifyToken)
commentRoutes.post('/', validateBody(commentValidate.create), commentController.create)
commentRoutes.delete('/:id', commentController.deleteComment)
export default commentRoutes