import productService from "../services/productService.js";
import { successResponse } from "../utils/response.js";

const getAll  = async (req, res, next) => {
  try {
    const result = await productService.getAll();
    return successResponse(res, {data: result}, 200);
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    await productService.create(req.body)
    return successResponse(res, {message: "Thêm mới sản phẩm thành công!"}, 200);
    
  }catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    await productService.destroy(req.params.id);
    return successResponse(res, {message: 'Xoá sản phẩm thành công!'}, 200)
  } catch (error) {
    next(error)
  }
}

export default  {
  getAll, create, destroy
}