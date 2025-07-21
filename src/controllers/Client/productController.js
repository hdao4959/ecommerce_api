import productsModel from "../../models/productsModel.js";
import variantColorModel from "../../models/variantColorModel.js";
import colorService from "../../services/Client/colorService.js";
import productService from "../../services/Client/productService.js";
import variantColorService from "../../services/Client/variantColorService.js";
import variantService from "../../services/Client/variantService.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
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