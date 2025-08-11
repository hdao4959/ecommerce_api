import notificationModel from "../../models/notificationModel"

const create = async (data) => {
  if(!data) return
  await notificationModel.create(data)
}

export default {
  create
}