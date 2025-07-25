import { getDb } from "../config/mongodb.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";
import ErrorCustom from "../utils/ErrorCustom.js";
import colorModel from "./colorModel.js";
const COLLECTION = 'variants'
const collection = () => getDb().collection(COLLECTION);
const getAll = async ({ conditions = {}, query = {}, projection = {} } = {}) => {
  const sortObject = {}
  sortObject[query?.sortBy || 'created_at'] = query?.orderBy == 'asc' ? 1 : -1
  const skip = parseInt(query?.skip) || 0
  const limit = parseInt(query?.limit) || 10
  return await collection().find(conditions, { projection }).sort(sortObject).skip(skip).limit(limit).toArray();
}

const create = async (data, options = {}) => {
  data.product_id &&= ConvertToObjectId(data.product_id);
  return await collection().insertOne(data, options);
}

const update = async (id, data, options = {}) => {
  return await collection().updateOne({
    _id: id
  }, {
    $set: data
  }, options)
  
}

const insertMany = async (array, options = {}) => {
  const colorObjectIds = array.flatMap(variant => variant.colors.map(ConvertToObjectId));
  const confirmExistColorIds = await colorModel.filter({ filter: { _id: { $in: colorObjectIds } } }, options)

  if (confirmExistColorIds.length != colorObjectIds.length) {
    throw new ErrorCustom("Có màu sắc không tồn tại trong hệ thống")
  }
  const newArray = array.map(variant => ({
    ...variant,
    colors: variant.colors.map(color => ({
      _id: ConvertToObjectId(color),
      stock: 0,
      price: 0,
      img: null,
      is_active: false,
    }))
  }))
  return await collection().insertMany(newArray);
}


const findById = async (id) => {
  return await collection().findOne({ _id: ConvertToObjectId(id) });
}

const findOneBy = async (payload) => {
  return await collection().findOne(payload);
}

const filter = async ({ filter = {}, projection = {} }) => {
  return await collection().find(filter, { projection }).toArray()
}

const destroy = async (id) => {
  return await collection().deleteOne({ _id: ConvertToObjectId(id) })
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
  COLLECTION, getAll, create, insertMany, findById, findOneBy, filter, destroy, countAll, countFiltered, join, update
}