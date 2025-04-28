import { ObjectId } from "bson";
import { getDb } from "../config/mongodb.js";
import CategoryValidate from "../validators/categoryValidate.js";

const COLLECTION = 'categories'

const collection = () => getDb().collection(COLLECTION);
 
const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : id)

// Lấy tất cả danh mục
const getAll = async () => {
  return await collection().find({ parent_id: null }).sort({_id: -1}).toArray()
}

// Lấy 1 danh mục bằng id
const findById = async (id) => {
  return await collection().findOne({ _id: toObjectId(id) })
}

// Tìm 1 danh mục theo điều kiện
const findBy = async (filter) => {
  if(!ObjectId.isValid(filter.id)){
    filter.id = toObjectId(filter.id);
  }

  return await collection().findOne(filter)
}

// Lọc ra danh sách danh mục theo điều kiện
const filter = async (filter) => {
  return await collection().find(filter).toArray()
}

// Tạo danh mục mới
const create = async (data, session = undefined) => {
    
  if (!data.parent_id) {
    data.parent_id = null
  }
  // await CategoryValidate.validateAsync(data);
  return await collection().insertOne(data, {session})
}

// Cập nhật danh mục theo id
const updateById = async (id, data, session = undefined) => {
  return await collection().findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: data },
    { returnDocument: 'after' },
    {session}
  )
}

// Xoá danh mục theo id
const deleteById = async (id, session = undefined) => {
  return await collection().deleteOne({ _id: toObjectId(id) }, {session})
}

// Danh sách các danh mục con theo id cha
const getChildrenByIdParent = async (idParent) => {
  return await collection().find({ parent_id: toObjectId(idParent)}).toArray()
}

const deleteChildrenByIdParent = async (parentId, session = undefined) => {
  return await collection().deleteMany({parent_id: toObjectId(parentId)}, {session})
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
  deleteChildrenByIdParent
}