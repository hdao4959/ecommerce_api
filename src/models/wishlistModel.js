import { getDb } from "../config/mongodb.js"

const COLLECTION = 'wishlist'
const collection = () => getDb().collection(COLLECTION)

const create = (data, options = {}) => {
  return collection().insertOne(data, options);
}

const findOne = async (conditions, options = {})=> {
  return await collection().findOne(conditions, options)
}

const destroy = async(conditions, options = {}) => {
  return await collection().deleteOne(conditions, options)
}

export default {
  create, findOne, destroy
}