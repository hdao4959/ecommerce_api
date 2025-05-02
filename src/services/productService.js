import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productsModel.js"
import ErrorCustom from "../utils/ErrorCustom.js";
const getAll = async () => {
  return await productModel.getAll();
}
const create = async (data) => {
  if (!data.category_id) {
    throw new ErrorCustom('Bạn chưa chọn danh mục sản phẩm!', 400);
  }

  const category = await categoryModel.findById(data.category_id);
  if (!category) {
    throw new ErrorCustom("Danh mục sản phẩm không tồn tại!", 404);
  }
  return await productModel.create(data);
}

const destroy = (id) => {
  
}
export default {
  getAll, create
}