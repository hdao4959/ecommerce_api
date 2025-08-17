import e from "express"
import { getDb } from "../config/mongodb.js"
import { ReturnDocument } from "mongodb"

const COLLECTION = "notifications"
const collection = () => getDb().collection(COLLECTION)

export const NOTIFICATION_TYPE = {
  message: "message",
  order: "order",
  comment: 'comment'
}

export const NOTIFICATION_REFERENCE_TYPE = {
  orders: "order",
  messages: "message",
  comment: 'comment'
}



const create = async (data, options) => {
  return await collection().insertOne(data, options)
}

const getAll = async ({ filter = {}, payload = {}, options = {} } = {}) => {
  const sortObject = {
    [payload?.sortBy || 'created_at']: payload?.orderBy == "asc" ? 1 : -1
  }
  const limit = parseInt(payload?.limit) || 10
  const skip = parseInt(payload?.offset) || 0
  return await collection().find(filter, options).sort(sortObject).skip(skip).limit(limit).toArray()
}
const countFiltered = async (filter, options = {}) => {
  return await collection().countDocuments(filter, options)
}

const update = async (payload = {}, data = {}, options = {}) => {
  return await collection().updateOne(
    payload,
    {
      $set: data,
    },
    options
  )
}

const findAndUpdate = async (payload = {}, data = {}, options = {}) => {
  return await collection().findOneAndUpdate(
    payload,
    { $set: data },
    options,
    { returnDocument: "after" }
  )
}

const destroy = async (conditions, options = {}) => {
  return await collection().deleteOne(conditions, options)
}
export default {
  create, countFiltered, getAll, update, findAndUpdate, destroy
}