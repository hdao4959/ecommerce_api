import specificationService from "../../services/Admin/specificationService.js"
import { successResponse } from "../../utils/response.js";

const create = async (req, res, next) => {
  try {
    await specificationService.create(req.body);
    return successResponse(res, {
      message: 'Thêm mới Thông số sản phẩm thành công!'
    }, 201)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const data = await specificationService.getAllWithMetadata(req.query);
    return successResponse(res, {
      data
    })
  } catch (error) {
    next(error)
  }
}

const getAllActive = async (req, res, next) => {
  try {
    const data = await specificationService.getAllWithMetadata(req.query);
    return successResponse(res, {
      data
    })
  } catch (error) {
    next(error)
  }
}

export default {
  create, getAll
}