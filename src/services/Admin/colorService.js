import colorModel from "../../models/colorModel.js"
// import variantModel from "../models/variantModel.js";
import ErrorCustom from "../../utils/ErrorCustom.js";

const getAll = async () => {
  return await colorModel.getAll();
}

const getAllActive = async (projection = {}) => {
  return await colorModel.getAllActive({ projection });
}

const getAllWithMetadata = async (query) => {
  let conditions = []
  if (query?.active) {
    switch (query.active) {
      case 1:
        conditions.push({
          is_active: true
        })
        break;
      case 0:
        conditions.push({
          is_active: false
        })
    }
  }

  if (query?.search) {
    conditions.push({
      $or: [
        {
          name: { $regex: query.search.trim(), $options: 'i' }
        }
      ]
    })
  }

  conditions = conditions.length > 0 ? { $and: conditions } : {}

  const colors = await colorModel.getAll({ query, conditions })
  const total = await colorModel.countAll();
  const totalFiltered = await colorModel.countFiltered(conditions)
  return {
    items: colors,
    meta: {
      total,
      totalFiltered
    }
  }
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

  const existColor = await colorModel.findOneBy({ _id: id })
  if (!existColor) {
    throw new ErrorCustom('Màu này không tồn tại!', 404);
  }
  return await colorModel.destroy(id);
}
export default {
  getAll, getAllActive, getAllWithMetadata, create, findOneBy, filter, destroy
}