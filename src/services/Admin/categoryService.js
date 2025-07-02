import { client } from "../../config/mongodb.js";
import categoryModel from "../../models/categoryModel.js";
import Category from "../../models/categoryModel.js"
import ErrorCustom from "../../utils/ErrorCustom.js";

const getAll = async () => {
  return await Category.getAll();
}

const getAllWithMetadata = async (query = {}) => {
  let conditions = []
  if (query && query.active) {
    switch (query.active) {
      case 1:
        conditions.push(
          { is_active: true }
        )
        break;
      case 0:
        conditions.push(
          { is_active: false }
        )
    }
  }
  if (query.search) {
    conditions.push({
      $or: [
        {
          name: {
            $regex: query.search.trim(), $options: "i"
          }
        }
      ]
    })
  }

  conditions = conditions.length > 0 ? { $and: conditions } : {}
  const categories = await categoryModel.getAll({ conditions, query })
  const total = await categoryModel.countAll();
  const totalFiltered = await categoryModel.countFiltered(query)
  return {
    items: categories,
    meta: {
      total,
      totalFiltered
    }
  }
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
  const result = await categoryModel.findById(id);
  if (!result) throw new ErrorCustom("Không tìm thấy danh mục sản phẩm");
  return result
}


const destroy = async (id) => {
  const session = await client.startSession()
  try {
    session.startTransaction();
    const category = await Category.findById(id);
    if (!category) {
      throw new ErrorCustom('Danh mục không tồn tại!', 404);
    }

    if(category?.type == 'not_delete'){
      throw new ErrorCustom('Danh mục này không thể xoá!', 419)
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

const getChildrenCategory = async (parentId) => {

  const parentCategory = await Category.findById(parentId);
  if (!parentCategory) {
    throw new ErrorCustom('Danh mục cha không tồn tại!', 404)
  }
  const childrenCategory = await Category.getChildrenByIdParent(parentId);

  return {
    'parentCategory': parentCategory,
    'childrenCategory': childrenCategory
  }
}

const getParentCategory = async (idParent) => {
  return await categoryModel.getParentCategory(idParent);
}

export default {
  getAll,
  getAllWithMetadata,
  create,
  update,
  findById,
  destroy,
  getChildrenCategory,
  getParentCategory
}