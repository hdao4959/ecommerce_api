import Category from "../models/categoryModel.js"
import categoryService from "../services/categoryService.js"
import { errorResponse, successResponse } from "../utils/response.js"
import CategoryValidate from "../validators/categoryValidate.js"
import CategorySchema from "../validators/categoryValidate.js"

const getAll = async (req, res, next) => {
  try {
    const result = await categoryService.getAll()
    return successResponse(res, {data: result},200);
  } catch (error) {
    next(error)
  }
}


const create = async (req, res, next) => {
  try {
    await categoryService.create(req.body);
    return successResponse(res, {message: 'Thêm danh mục mới thành công!'}, 201)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    await categoryService.update(req.params.id, req.body)
    return successResponse(res, {message: "Cập nhật danh mục thành công!"}, 201);
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) =>{
  try {
    const categoryId = req.params.id;
    const result = await categoryService.destroy(categoryId)

    if(!result.success){
      return errorResponse(res, {message: result.message}, result.statusCode);
    }

    return successResponse(res, {message: result.message}, result.statusCode);
  } catch (error) {
    next(error)
  }
}


const getChildrentCategory = async (req, res, next) => {
  
  try {
    const result = await categoryService.getChildrentCategory(req.params.id)
    return successResponse(res, {data: result}, 200);
  } catch (error) {
    next(error)
  }
}

export default {
  getAll, create, update, destroy, getChildrentCategory
} 