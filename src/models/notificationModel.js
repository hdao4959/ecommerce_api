import e from "express"
import { getDb } from "../config/mongodb.js"

const COLLECTION = "notifications"
const collection = () => getDb().collection(COLLECTION)

export const NotificationType = {
  message: "message",
  order: "order"
}

export const NotificationReferenceType = {
  orders: "orders",
  messages: "messages"
}



const create = async (data, options) => {
  await collection().insertOne(data, options)
}

export default {
  create
}