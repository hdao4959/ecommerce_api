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

  const existNameProduct = await productModel.findBy({name: data.name})
  if(existNameProduct){
    throw new ErrorCustom('Tên sản phẩm đã tồn tại', 409);
  }
  return await productModel.create(data);
}

const findById = async (id) => {
  return await productModel.findById(id);
}

const destroy = async (id) => {
  if(!id){
    throw new ErrorCustom('Bạn chưa chuyền id sản phẩm', 404)
  }
  const product = await productModel.findById(id);
  if(!product){
    throw new ErrorCustom('Sản phẩm không tồn tại!', 404)
  }
  return await productModel.destroy(id);
}
export default {
  getAll, create, findById, destroy
}