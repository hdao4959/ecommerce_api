import colorModel from "../models/colorModel.js"
// import variantModel from "../models/variantModel.js";
import ErrorCustom from "../utils/ErrorCustom.js";

const getAll = async () => {
  return await colorModel.getAll();
}

const getAllActive = async() => {
  return await colorModel.getAllActive();
}

const create = async (data) => {
  const existColor = await colorModel.findOneBy({ name: data.name });
  if (existColor) {
    throw new ErrorCustom('Tên màu đã tồn tại', 409);
  }
  return await colorModel.create(data);
}

const findOneBy = async (payload) => {
  return await colorModel.findOneBy(payload);
}

const filter = async (payload) => {
  return await colorModel.filter(payload);
}

const destroy = async (id) => {
  console.log(id);
  
  const existColor = await colorModel.findOneBy({_id: id})
  if(!existColor){
    throw new ErrorCustom('Màu này không tồn tại!', 404);
  }
  return await colorModel.destroy(id);
}
export default {
  getAll, getAllActive, create, findOneBy, filter, destroy
}