import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'categories'

const collection = () => getDb().collection(COLLECTION);

// Lấy tất cả danh mục
const getAll = async ({ conditions = {}, query = {}, projection = {} }) => {

  const sortObject = {};
  sortObject[query?.sortBy || 'created_at'] = query?.orderBy === 'asc' ? 1 : -1
  const limit = parseInt(query?.limit) || 10;
  const skip = parseInt(query?.offset) || 0
  return await collection().find(conditions, { projection }).sort(sortObject).skip(skip).limit(limit).toArray()
}

// Lấy 1 danh mục bằng id
const findById = async (id) => {

  return await collection().findOne({ _id: ConvertToObjectId(id) })
}

// Tìm 1 danh mục theo điều kiện
const findBy = async (payload) => {
  if (payload?.id) {
    payload.id = ConvertToObjectId(payload.id);
  }

  return await collection().findOne(payload)
}

// Lọc ra danh sách danh mục theo điều kiện
const filter = async ({filter = {}, projection = {}}) => {

  return await collection().find(filter, projection).toArray()
}

// Tạo danh mục mới
const create = async (data, options = {}) => {

  if (!data.parent_id) {
    data.parent_id = null
  }
  // await CategoryValidate.validateAsync(data);
  return await collection().insertOne(data, options)
}

// Cập nhật danh mục theo id
const updateById = async (id, data, options = {}) => {
  return await collection().findOneAndUpdate(
    { _id: ConvertToObjectId(id) },
    { $set: data },
    { returnDocument: 'after' },
    options
  )
}

// Xoá danh mục theo id
const deleteById = async (id, options = {}) => {
  return await collection().deleteOne({ _id: ConvertToObjectId(id) }, options)
}

const countAll = async () => {
  return await collection().countDocuments();
}

const countFiltered = async (conditions) => {
  return await collection().countDocuments(conditions)
}


const deleteMany = async ({ conditions = {}, options = {} }) => {
  return await collection().deleteMany(conditions, options)
}

const join = async (stages = []) => {
  
  return await collection().aggregate(stages).toArray()
}
export default {
  COLLECTION,
  findBy,
  create,
  getAll,
  findById,
  filter,
  updateById,
  deleteById,
  countAll,
  countFiltered,
  deleteMany,
  join
}