import { getDb } from "../config/mongodb.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";
import ErrorCustom from "../utils/ErrorCustom.js";
import colorModel from "./colorModel.js";
const COLLECTION = 'variants'
const collection = () => getDb().collection(COLLECTION);
const getAll = async ({query = {}, projection = {}} = {}) => {
  return await collection().find(query, {projection}).toArray();
}

const create = async (data) => {
  data.product_id &&= ConvertToObjectId(data.product_id);
  return await collection().insertOne(data);
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
export default {
  getAll, create, insertMany, findById, findOneBy, filter, destroy
}