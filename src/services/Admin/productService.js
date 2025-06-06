import { client } from "../../config/mongodb.js";
import categoryModel from "../../models/categoryModel.js";
import colorModel from "../../models/colorModel.js";
import productModel from "../../models/productsModel.js"
import variantModel from "../../models/variantModel.js";
import ErrorCustom from "../../utils/ErrorCustom.js";
const getAll = async ({ query = {}, projection = {}} = {}) => {
  return await productModel.getAll({ query: query, projection: projection });
}
const create = async (data) => {
  // Nếu có id danh mục con thì gán id danh mục con thay cho danh mục cha
  if (data.child_category_id) data.category_id = data.child_category_id;
  delete data.child_category_id;

  if (!data.category_id) {
    throw new ErrorCustom('Bạn chưa chọn danh mục sản phẩm!', 400);
  }

  const category = await categoryModel.findById(data.category_id);
  if (!category) {
    throw new ErrorCustom("Danh mục sản phẩm không tồn tại!", 404);
  }

  const existNameProduct = await productModel.findOneBy({ payload: { name: data.name } })
  if (existNameProduct) {
    throw new ErrorCustom('Tên sản phẩm đã tồn tại', 409);
  }
  return await productModel.create(data)
}

const update = async (id, data) => {
  return await productModel.update(id, data)
}

const filter = async (filter) => {
  return await productModel.filter(filter);
}


const findById = async (id) => {
  return await productModel.findById(id);
}

const destroy = async (id) => {
  if (!id) {
    throw new ErrorCustom('Bạn chưa chuyền id sản phẩm', 404)
  }
  const product = await productModel.findById(id);
  if (!product) {
    throw new ErrorCustom('Sản phẩm không tồn tại!', 404)
  }
  return await productModel.destroy(id);
}
export default {
  getAll, create, update, findById, filter, destroy
}