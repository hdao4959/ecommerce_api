import notificationModel from "../../models/notificationModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";

const notificationsRecent = async (query) => {
  const notifications = await notificationModel.getAll({
    options: {
      projection: {
        updated_at: 0,
        deleted_at: 0,
      }
    }
  });

  const countUnread = await notificationModel.countFiltered({
    is_read: false
  })

  return {
    notifications,
    countUnread
  }
}

const handleReadNotification = async (req) => {
  const notifyId = req.params?.id
  await notificationModel.findAndUpdate({
    _id: ConvertToObjectId(notifyId),
    is_read: false
  }, {
    is_read: true
  })

}
export default {
  notificationsRecent, handleReadNotification
}