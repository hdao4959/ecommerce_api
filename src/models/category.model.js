import { ObjectId } from "bson";
import { getDb } from "../config/mongodb.js";

const COLLECTION = 'categories'

// Lấy tất cả danh mục
const getAll = async () => {
  return await getDb().collection(COLLECTION).find({}).toArray()
}

// Lấy 1 danh mục bằng id
const findById = async (id) => {
  const isValid = ObjectId.isValid(id);
  return await getDb().collection(COLLECTION).findOne({ _id: isValid ? new ObjectId(id) : id })
}

// Lọc danh mục theo điều kiện
const findBy = async (filter) => {
  return await getDb().collection(COLLECTION).findOne(filter)
}

// Tạo danh mục mới
const create = async (data) => {
  if(!data.parent_id){
    data.parent_id = null
  }
  return await getDb().collection(COLLECTION).insertOne(data)
}

// Cập nhật danh mục theo id
const updateById = async (id, data) => {
  const isValid = ObjectId.isValid(id);
  return await getDb().collection(COLLECTION).findOneAndUpdate(
    { _id: isValid ? new ObjectId(id) : id },
    { $set: data },
    { returnDocument: 'after' })
}

// Xoá danh mục theo id
const deleteById = async (id) => {
  const isValid = ObjectId.isValid(id);
  return await getDb().collection(COLLECTION).deleteOne({ _id: isValid ? new ObjectId(id) : id })
}


export default {
  findBy, 
  create, 
  getAll, 
  findById, 
  updateById, 
  deleteById
}