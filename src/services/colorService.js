import colorModel from "../models/colorModel.js"
import variantModel from "../models/variantModel.js";
import ErrorCustom from "../utils/ErrorCustom.js";

const getAll = async () => {
  return await colorModel.getAll();
}

const create = async (data) => {

  const variant = await variantModel.findById(data.variant_id);
  if (!variant) {
    throw new ErrorCustom('Biến thể bạn chọn cho màu sắc không tồn tại!', 404);
  }

  const existColor = await colorModel.findOneBy({ name: data.name, variant_id: data.variant_id });
  if (existColor) {
    throw new ErrorCustom('Tên màu đã tồn tại cho biến thể này rồi', 409);
  }
  return await colorModel.create(data);
}

const findOneBy = async (payload) => {
  return await colorModel.findOneBy(payload);
}

const filter = async (payload) => {
  return await colorModel.filter(payload);
}
export default {
  getAll, create, findOneBy, filter
}