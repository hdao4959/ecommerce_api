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
    throw new Error('Danh mục này không tồn tại!')
  }
  const existName = await Category.findBy({
    name: data?.name, _id: {
      $ne: id
    }
  })

  if (existName) {
    throw new Error('Tên danh mục này đã tồn tại!')
  }

  if (data?.parent_id) {
    const existParentCategory = await Category.findBy({ parent_id: id });
    if (!existParentCategory) {
      throw new Error('Danh mục cha không tồn tại!')
    }
  }
  return await Category.updateById(id, data);
}


const destroy = async (id) => {
  const session = client.startSession()
  try {
    session.startTransaction();
    const category = await Category.findById(id);
    if (!category) {
      await session.abortTransaction();
      return {
        success: false,
        message: 'Danh mục không tồn tại',
        statusCode: 404
      }
    }
    await Category.deleteChildrenByIdParent(id, session);
    const deleted = await Category.deleteById(id, session);
    if (!deleted) {
      await session.abortTransaction();
      return {
        success: false,
        message: "Đã xảy ra lỗi khi xoá!",
        statusCode: 500
      }
    }

    await session.commitTransaction();
    return {
      success: true,
      message: "Xoá danh mục thành công",
      statusCode: 200
    }
  } catch (error) {

    await session.abortTransaction()
    return {
      success: false,
      message: error.message || "Có lỗi không xác định",
      statusCode: 500
    }
  } finally {
    session.endSession()
  }
}

const getChildrentCategory = async (parentId) => {
  return await Category.getChildrenByIdParent(parentId);
}

export default {
  getAll,
  create,
  update,
  destroy,
  getChildrentCategory
}