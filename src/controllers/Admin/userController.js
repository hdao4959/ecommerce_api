import userService from "../../services/Admin/userService.js";
import { successResponse } from "../../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    const response = await userService.getAllWithMetadata(req.query);
    return successResponse(res, {
      data: {
        ...response
      }
    })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    await userService.create(req.body);
    return successResponse(res, {
      message: 'Thêm tài khoản mới thành công!'
    })
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    await userService.destroy(req.params.id);
    return successResponse(res, {message: 'Xoá người dùng thành công'}, 200);
  } catch (error) {
    next(error)
  }
}
export default {
  getAll, create, destroy
}