import colorService from "../../services/Admin/colorService.js"
import { successResponse } from "../../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    let result = null;
    // Chỉ lấy các màu sắc có is_active = true
    if (req?.query?.active == 1) {
      result = await colorService.getAllActive({created_at: 0, updated_at: 0, deleted_at: 0, status: 0});
    } else {
      result = await colorService.getAll();
    }

    return successResponse(res, {
      data: {
        'colors': result
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    await colorService.create(req.body);
    return successResponse(res, { message: 'Thêm biến thể màu sắc thành công!' }, 201)
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    await colorService.destroy(req.params.id);
    return successResponse(res, { message: 'Xoá màu sắc thành công' }, 200)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll, create, destroy
}