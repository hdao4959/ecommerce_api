import wishlistService from "../../services/Client/wishlistService.js"
import { errorResponse, successResponse } from "../../utils/response.js"

const create = async (req, res, next) => {
  try {
    const result = await wishlistService.create(req.user, req.body)
    return successResponse(res, {
      message: result.message,
      data: {
        action: result.action
      }
    })
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, { message: "Sản phẩm này đã có trong wishlist rồi" }, 401)
    } else {
      next(error)
    }
  }
}

export default {
  create
}