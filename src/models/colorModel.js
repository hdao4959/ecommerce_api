import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'colors';
const collection = () => getDb().collection(COLLECTION);

const getAll = async ({ query, conditions, projection = {} }) => {
  const sortObject = {}
  sortObject[query?.sortBy || 'created_at'] = query?.orderBy == 'asc' ? 1 : -1
  const limit = parseInt(query?.limit) || 10;
  const skip = parseInt(query?.offset) || 0
  return await collection().find(conditions, projection).sort(sortObject).skip(skip).limit(limit).toArray();
}

const getAllActive = async ({ projection = {} }) => {
  return await collection().find({ is_active: true }, { projection }).sort({ _id: -1 }).toArray();
}

const create = async (data) => {
  data.variant_id &&= ConvertToObjectId(data.variant_id);
  return await collection().insertOne(data);
}

const filter = async ({ filter = {}, projection = {} }) => {

  return await collection().find(filter, { projection }).toArray()
}
const findOneBy = async (payload) => {
  const query = { ...payload };
  if (query._id) {
    query._id = ConvertToObjectId(query._id);
  }
  return await collection().findOne(query);
}

const destroy = async (id) => {
  return await collection().deleteOne({ _id: ConvertToObjectId(id) });
}

const countAll = async () => {
  return await collection().countDocuments();
}

const countFiltered = async (conditions) => {
  return await collection().countDocuments(conditions)
}

export default {
  COLLECTION, getAll, getAllActive, create, findOneBy, filter, destroy, countAll, countFiltered
}