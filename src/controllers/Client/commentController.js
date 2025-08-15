import commentService from "../../services/Client/commentService.js";
import { successResponse } from "../../utils/response.js";

const create = async (req, res, next) => {
  try {
    const comment = await commentService.create(req)
    return successResponse(res, {
      message: 'Viết đánh giá thành công!',
      data: {
        comment
      }
    })
  } catch (error) {
    next(error)
  }
}

const getListForProduct = async (req, res, next) => {
  try {
    const comments = await commentService.getListForProduct(req)
    return successResponse(res, {
      data: {
        comments
      }
    })
  } catch (error) {
    next(error)
  }
}
export default {
  create, getListForProduct
}