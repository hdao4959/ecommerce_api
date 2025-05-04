import variantService from "../services/variantService.js"
import { successResponse } from "../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    const result = await variantService.getAll();
    return successResponse(res, {data: result}, 200);
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    await variantService.create(req.body);
    return successResponse(res, {message: 'Thêm mới biến thể thành công!'},201)
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next)=> {
  try {
    await variantService.destroy(req.params.id);
    return successResponse(res, {message: "Xoá biến thể thành công!"},200);
  } catch (error) {
    next(error)
  }
}
export default {
  getAll, create, destroy
}