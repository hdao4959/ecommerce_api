import { getDb } from "../config/mongodb.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'products'

const collection = () =>  getDb().collection(COLLECTION);

const getAll = async () => {
  return await collection().find({}).toArray();
}

const create = async (data) => {
  if(data.category_id){
    data.category_id = ConvertToObjectId(data.category_id)
  }
  return await collection().insertOne(data)
}

const findById = async (id) => {
  return await collection().findOne({_id: ConvertToObjectId(id)})
}

const findBy = async (payload) => {
  return await collection().findOne(payload)
}
const destroy = async (id) => {
  await collection().deleteOne({ _id: ConvertToObjectId(id) })
}
export default {
  getAll, create, findById, findBy, destroy
}