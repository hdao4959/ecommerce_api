import categoryService from "../../services/Admin/categoryService.js";
import { successResponse } from "../../utils/response.js"

const getAll = async (req, res, next) => {
  try {
    const result = await categoryService.getAll()
    return successResponse(res, { data: result }, 200);
  } catch (error) {
    next(error)
  }
}


const create = async (req, res, next) => {
  try {
    await categoryService.create(req.body);
    return successResponse(res, { message: 'Thêm danh mục mới thành công!' }, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    await categoryService.update(req.params.id, req.body)
    return successResponse(res, { message: "Cập nhật danh mục thành công!" }, 201);
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    await categoryService.destroy(categoryId)
    return successResponse(res, { message: "Xoá danh mục thành công!" }, 200)
  } catch (error) {
    next(error)
  }
}


const getChildrenCategory = async (req, res, next) => {

  try {
    const result = await categoryService.getChildrenCategory(req.params.id)
    return successResponse(res, { data: result }, 200);
  } catch (error) {
    next(error)
  }
}

const getParentCategory = async (req, res, next) => {
  try {
    const result = categoryService.getParentCategory(req.params.id);
    return successResponse(res, { data: result }, 200);
  } catch (error) {
    next(error)
  }
}

export default {
  getAll, 
  create, 
  update, 
  destroy, 
  getChildrenCategory,
  getParentCategory
} 