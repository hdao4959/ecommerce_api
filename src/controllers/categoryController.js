import Category from "../models/categoryModel.js"
import categoryService from "../services/categoryService.js"
import { successResponse } from "../utils/response.js"
import CategoryValidate from "../validators/categoryValidate.js"
import CategorySchema from "../validators/categoryValidate.js"

const getAll = async (req, res, next) => {
  try {
    const result = await categoryService.getAll()
    return res.json(result)
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

    const deleted = await Category.deleteById(categoryId);
    if (!deleted) {
      return res.status(404).json({
        message: "Danh mục này không tồn tại!"
      })
    }

    return res.status(200).json({
      message: "Xoá danh mục thành công!"
    })
  } catch (error) {
    next(error)
  }
}
const getChildrentCategory = async (req, res, next) => {
  
  try {
    const result = await Category.getChildrenByIdParent(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll, create, update, destroy, getChildrentCategory
} 