import { getDb } from "../config/mongodb.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'users'
const collection = () => getDb().collection(COLLECTION);

const create = async (data) => {
  return await collection().insertOne(data);
}

const getAll = async ({ conditions = {}, query = {}, projection = {} }) => {
  const sortObject = {}
  sortObject[query?.sortBy || 'created_at'] = query?.orderBy === 'asc' ? 1 : -1
  const limit = parseInt(query?.limit) || 10
  const skip = parseInt(query?.offset) || 0;
  return await collection().find(conditions, { projection }).sort(sortObject).skip(skip).limit(limit).toArray();
}

const findOneBy = async ({ payload = {}, projection = {} } = {}) => {
  if (payload.id) {
    payload.id = ConvertToObjectId(payload.id);
  }
  return await collection().findOne(payload, { projection });
}

const update = async (id, data, options = {}) => {
  id = ConvertToObjectId(id);
  return await collection().updateOne({ _id: id }, { $set: data }, options)
}

const countAll = async () => {
  return await collection().countDocuments();
}

const countFiltered = async (conditions = {}) => {
  return await collection().countDocuments(conditions)
}

const destroy = async (id) => {
  return await collection().deleteOne({_id: ConvertToObjectId(id)});
}

export default {
  create, getAll, findOneBy, update, countAll, countFiltered, destroy
}