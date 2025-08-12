import express from 'express'
import notificationController from '../../../controllers/Admin/notificationController.js'
const notificationRoutes = express.Router()

notificationRoutes.get('/recent', notificationController.getNotificationRecent)
notificationRoutes.put('/:id/read', notificationController.handleReadNotification)
export default notificationRoutes