import slugify from "slugify";
import { getDb } from "../config/mongodb.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'products'

const collection = () => getDb().collection(COLLECTION);

const getAll = async ({ conditions = {}, query = {}, projection = {} } = {}) => {
  const sortObject = {}
  sortObject[query?.sortBy || 'created_at'] = query?.orderBy == 'asc' ? 1 : -1
  const limit = parseInt(query?.limit) || 10;
  const skip = parseInt(query?.offset) || 0
  return await collection().find(conditions, { projection }).sort(sortObject).skip(skip).limit(limit).toArray();
}


const create = async (data, options = {}) => {
  data.category_id = ConvertToObjectId(data.category_id)
  if (data.name) {
    data.slug = slugify(data.name);
  }
  return await collection().insertOne(data, options)
}

const update = async (id, data, options = {}) => {
  const objectId = ConvertToObjectId(id);
  return await collection().updateOne({ _id: objectId }, { $set: data }, options)
}



const findById = async (id) => {
  return await collection().findOne({ _id: ConvertToObjectId(id) })
}

const findOneBy = async ({ payload = {}, projection = {} }) => {
  return await collection().findOne(payload, { projection })
}

const filter = async ({ filter = {}, query = {}, projection = {} }) => {
  const sortObject = {
    [query?.sortBy || 'created_at']: query?.orderBy == 'asc' ? 1 : -1
  }
  const limit = query?.limit || 10;
  const skip = query?.offset || 0
  return await collection().find(filter, { projection }).skip(skip).sort(sortObject).limit(limit).toArray()
}
const destroy = async (id) => {
  await collection().deleteOne({ _id: ConvertToObjectId(id) })
}

const countAll = async () => {
  return await collection().countDocuments();
}

const countFiltered = async (conditions) => {
  return await collection().countDocuments(conditions)
}

const join = async (stages = []) => {
  return await collection().aggregate(stages).toArray()
}
export default {
  getAll, create, update, findById, findOneBy, filter, destroy, countAll, countFiltered, join
}