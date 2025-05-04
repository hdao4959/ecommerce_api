import colorService from "../services/colorService.js"
import { successResponse } from "../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    const result = await colorService.getAll();
    return successResponse(res, {data: result}, 200)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res ,next) => {
  try {
    await colorService.create(req.body);
    return successResponse(res, {message: 'Thêm biến thể màu sắc thành công!'}, 201)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll, create
}