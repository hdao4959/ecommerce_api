import { getDb } from "../config/mongodb.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";
const COLLECTION = 'variants'
const collection = () => getDb().collection(COLLECTION);
const getAll = async () => {
  return await collection().find({}).toArray();
}

const create = async (data) => {
  // Chuyền đổi chuỗi id thành Object Id
  data.product_id &&= ConvertToObjectId(data.product_id);
  return await collection().insertOne(data);
}

const findById = async (id) => {
  return await collection().findOne({_id: ConvertToObjectId(id)});
}

const findOneBy = async (payload) => {
  return await collection().findOne(payload);
}

const destroy = async (id) => {
  return await collection().deleteOne({_id: ConvertToObjectId(id)})
}
export default {
  getAll, create,findById, findOneBy, destroy
}