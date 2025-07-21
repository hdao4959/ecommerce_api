import { getDb } from "../config/mongodb.js";

const COLLECTION = 'variant_specification';
const collection = () => getDb().collection(COLLECTION);

const insertMany = async (data, options = {}) => {
  return await collection().insertMany(data, options)
}

const deleteMany = async (payload, options = {}) => {
  return await collection().deleteMany(payload, options)
}
export default {
  COLLECTION,
  insertMany,
  deleteMany
}