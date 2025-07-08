import colorService from "../../services/Admin/colorService.js"
import { successResponse } from "../../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    const colors = await colorService.getAllWithMetadata(req.query);

    return successResponse(res, {
      data: {
        ...colors
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