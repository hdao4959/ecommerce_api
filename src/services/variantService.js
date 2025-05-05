import productsModel from "../models/productsModel.js";
import variantModel from "../models/variantModel.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";
import ErrorCustom from "../utils/ErrorCustom.js";

const getAll = async () => {
  return await variantModel.getAll();
}

const create = async (data) =>{
  if(data.product_id){
    const product = await productsModel.findById(data.product_id);
    if(!product){
      throw new ErrorCustom('Dòng sản phẩm bạn chọn không tồn tại!', 404);
    }
  }

  if(data.name){
    const existNameVariant = await variantModel.findOneBy({name: data.name, product_id: ConvertToObjectId(data.product_id)});
    if(existNameVariant){
      throw new ErrorCustom("Tên biến thể này đã được tạo cho dòng sản phẩm này", 409)
    }
  }

  return await variantModel.create(data);
}

const findById = async (id) => {
  return await variantModel.findById(id);
}
const findOneBy = async (payload) => {
  return await variantModel.findOneBy(payload);
}

const filter = async (filter) => {
  return await variantModel.filter(filter);
}

const destroy = async (id) => {
  const variant = await variantModel.findById(id);
  if(!variant) {
    throw new ErrorCustom('Biến thể này không tồn tại!', 404);
  }
  return await variantModel.destroy(id);

}

export default {
  create, getAll, findById, findOneBy, filter, destroy
}