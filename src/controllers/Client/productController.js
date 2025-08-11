import productService from "../../services/Client/productService.js";
import { successResponse } from "../../utils/response.js";

const detail = async (req, res, next) => {
  try {
    const dataDetail = await productService.detailPage(req)
    return successResponse(res, {
      data: {
        ...dataDetail
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

export default {
  detail
}