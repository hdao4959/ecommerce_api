import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'colors';
const collection = () => getDb().collection(COLLECTION);

const getAll = async () => {
  return await collection().find({}).toArray();
}
const create = async (data) => {
  data.variant_id &&= ConvertToObjectId(data.variant_id);
  return await collection().insertOne(data);
}

const filter = async (payload) => {
  return await collection().find(payload).toArray()
}
const findOneBy = async (payload) => {
  return await collection().findOne(payload);
}

export default {
  getAll, create, findOneBy, filter
}