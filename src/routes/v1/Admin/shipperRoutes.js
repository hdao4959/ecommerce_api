import express from 'express'
import shipperController from '../../../controllers/Admin/shipperController.js'
import validateBody from '../../../middlewares/validateBody.js'
import shipperValidate from '../../../validators/shipperValidate.js'
const shipperRoutes = express.Router()
shipperRoutes.get('/', shipperController.getListShipper)
shipperRoutes.post('/', validateBody(shipperValidate.create), shipperController.createNewShipper)
export default shipperRoutes
