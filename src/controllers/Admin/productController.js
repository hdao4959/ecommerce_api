import productService from "../../services/Admin/productService.js";
import { errorResponse, successResponse } from "../../utils/response.js";
import qs from 'qs'

const getAll = async (req, res, next) => {
  try {
    const result = await productService.getAllWithMetadata(req.query);
    return successResponse(res, { data: result }, 200);
  } catch (error) {
    next(error)
  }
}

const detail = async (req, res, next) => {
  try {
    if (!req?.params?.id) {
      return errorResponse(res, { message: 'Sản phẩm không xác định' }, 404);
    }
    const product = await productService.getDetail(req.params.id);
    return successResponse(res, { data: product }, 200)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    await productService.create(req.body);
    return successResponse(res, { message: "Thêm mới sản phẩm thành công!" }, 200);
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    await productService.update(req.params.id, req.body);
    return successResponse(res, { message: 'Chỉnh sửa thành công' }, 200);
  } catch (error) {
    next(error)
  }
}



const destroy = async (req, res, next) => {
  try {
    await productService.destroy(req.params.id);
    return successResponse(res, { message: 'Xoá sản phẩm thành công!' }, 200)
  } catch (error) {
    next(error)
  }
}

const getVariantsOfProduct = async (req, res, next) => {
  try {
    
    const responseVariants = await productService.getVariantsOfProduct(req?.params?.id);
    return successResponse(res, {
      data: {
        ...responseVariants
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

export default {
  getAll, create, update, detail, destroy,getVariantsOfProduct
}