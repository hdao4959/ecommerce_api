import { getDb } from "../config/mongodb.js";

const COLLECTION = 'order_items';
const collection = () => getDb().collection(COLLECTION);

const insertMany = async (data, options = {}) => {
  return await collection().insertMany(data, options);
}
export default {
  insertMany
}