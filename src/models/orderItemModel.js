import { getDb } from "../config/mongodb.js";

const COLLECTION = 'order_items';
const collection = () => getDb().collection(COLLECTION);

const insertMany = async (data, options = {}) => {
  return await collection().insertMany(data, options);
}

const filter = async ({filter ={}, projection = {}}) => {
  return await collection().find(filter, {projection}).toArray()
}

export default {
  insertMany, filter
}