import { getDb } from "../config/mongodb.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'products'

const collection = () =>  getDb().collection(COLLECTION);

const getAll = async () => {
  return await collection().find({}).toArray();
}

const create = async (data) => {

  return await collection().insertOne(data)
}

const destroy = async (id) => {
  await collection().deleteOne({ _id: ConvertToObjectId(id) })
}
export default {
  getAll, create
}