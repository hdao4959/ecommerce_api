import { ObjectId } from "bson";
import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'categories'

const collection = () => getDb().collection(COLLECTION);
 


// Lấy tất cả danh mục
const getAll = async () => {
  return await collection().find({ parent_id: null }).sort({_id: -1}).toArray()
}

// Lấy 1 danh mục bằng id
const findById = async (id) => {
  return await collection().findOne({ _id: ConvertToObjectId(id) })
}

// Tìm 1 danh mục theo điều kiện
const findBy = async (payload) => {
  if(!ObjectId.isValid(payload.id)){
    payload.id = ConvertToObjectId(payload.id);
  }

  return await collection().findOne(payload)
}

// Lọc ra danh sách danh mục theo điều kiện
const filter = async (filter) => {
  return await collection().find(filter).toArray()
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

// Danh sách các danh mục con theo id cha
const getChildrenByIdParent = async (idParent) => {
  return await collection().find({ parent_id: ConvertToObjectId(idParent)}).toArray()
}

const getParentCategory = async(idParent) => {
  return await collection().findOne({_id: ConvertToObjectId(idParent)})
}
const deleteChildrenByIdParent = async (parentId, options = {}) => {
  return await collection().deleteMany({parent_id: ConvertToObjectId(parentId)}, options)
}

export default {
  findBy,
  create,
  getAll,
  findById,
  filter,
  updateById,
  deleteById,
  getChildrenByIdParent,
  getParentCategory,
  deleteChildrenByIdParent
}