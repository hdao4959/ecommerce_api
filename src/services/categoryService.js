import { ObjectId } from "mongodb";
import { client } from "../config/mongodb.js";
import categoryModel from "../models/categoryModel.js";
import Category from "../models/categoryModel.js"
import ErrorCustom from "../utils/ErrorCustom.js";

const getAll = async () => {
  return await Category.getAll();
}

const create = async (data) => {

  const exist = await Category.findBy({ name: data?.name });
  if (exist) {
    throw new ErrorCustom('Tên danh mục đã tồn tại!', 400)
  }

  if (data.parent_id) {
    const existParentCategory = await Category.findById(data.parent_id);
    if (!existParentCategory) {
      throw new ErrorCustom('Danh mục cha không tồn tại!', 404)
    }
  }

  return await Category.create(data);
}

const update = async (id, data) => {
  const exist = await Category.findById(id);
  if (!exist) {
    throw new ErrorCustom('Danh mục này không tồn tại!')
  }
  const existName = await Category.findBy({
    name: data?.name,
    _id: {
      $ne: id
    }
  })

  if (existName) {
    throw new ErrorCustom('Tên danh mục này đã tồn tại!')
  }

  if (data?.parent_id) {
    const existParentCategory = await Category.findById(data.parent_id);
    if (!existParentCategory) {
      throw new Error('Danh mục cha không tồn tại!')
    }
  }
  return await Category.updateById(id, data);
}

const findById = async (id) => {
  const result =  await categoryModel.findById(id);
  if(!result) throw new ErrorCustom("Không tìm thấy danh mục sản phẩm");
  return result
}


const destroy = async (id) => {
  const session = client.startSession()
  try {
    session.startTransaction();
    // Tìm xem category có tồn tại không
    const category = await Category.findById(id);
    if (!category) {
      throw new ErrorCustom('Danh mục không tồn tại!', 404);
    }
    // Xoá các danh mục con
    await Category.deleteChildrenByIdParent(id, session);
    // Xoá danh mục 
    await Category.deleteById(id, session);
    return await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const getChildrentCategory = async (parentId) => {
  
  const parentCategory = await Category.findById(parentId);
  if (!parentCategory) {
    throw new ErrorCustom('Danh mục cha không tồn tại!', 404)
  }
  const childrentCategory = await Category.getChildrenByIdParent(parentId);

  return {
    'parentCategory': parentCategory,
    'childrentCategory': childrentCategory
  }
}

const getParentCategory = async (idParent) => {
  return await categoryModel.getParentCategory(idParent);
}

export default {
  getAll,
  create,
  update,
  findById,
  destroy,
  getChildrentCategory,
  getParentCategory
}