import notificationService from "../../services/Admin/notificationService.js"
import { successResponse } from "../../utils/response.js"

const getNotificationRecent = async (req, res, next) => {
  try {
    const result = await notificationService.notificationsRecent(req.query)

    return successResponse(res, {
      data: {
        ...result
      }
    })
  } catch (error) {
    next(error)
  }
}

const handleReadNotification = async (req, res, next) => {
  try {

    await notificationService.handleReadNotification(req);

    return successResponse(res)
  } catch (error) {
    next(error)
  }
}

export default {
  getNotificationRecent, handleReadNotification
}