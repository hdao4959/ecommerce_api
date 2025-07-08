import colorService from "../../services/Admin/colorService.js";
import productService from "../../services/Admin/productService.js";
import variantService from "../../services/Admin/variantService.js";
import { errorResponse, successResponse } from "../../utils/response.js";
import categoryService from "../../services/Admin/categoryService.js";
import colorModel from "../../models/colorModel.js";
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
    const body = qs.parse(req.body);
    // console.log(body);

    await productService.update(req.params.id, body);
    // const images = req.files.filter(file => file.fieldname.includes('img'))
    // console.log(images);
    return successResponse(res, { message: 'Chỉnh sửa thành công' }, 200);
  } catch (error) {
    next(error)
  }
}

const updateVariants = async (req, res, next) => {
  try {
    // return successResponse(res, {data: req.body.variants[0].colors[0]})
    console.log(req.files);

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

export default {
  getAll, create, updateVariants, update, detail, destroy
}