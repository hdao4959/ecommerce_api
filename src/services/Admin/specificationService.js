import specificationModel from "../../models/specificationModel.js"
import ErrorCustom from "../../utils/ErrorCustom.js";

const create = async (data) => {
  const existName = await specificationModel.findOne({
    payload: {
      name: data?.name
    }
  })

  if (existName) {
    throw new ErrorCustom('Tên Thông số đã tồn tại, vui lòng nhập tên khác!', 409)
  }
  return await specificationModel.create(data);
}

const getAllWithMetadata = async (query) => {
  let conditions = [];
  if (query?.active) {
    switch (query.active) {
      case 1:
        conditions.push({
          is_active: true
        })
        break;
      case -1:
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
        },
      ]
    })
  }
  conditions = conditions.length > 0 ? { $and: conditions } : {}

  const specifications = await specificationModel.getAll({ conditions, query })
  const total = await specificationModel.countAll();
  const totalFiltered = await specificationModel.countFiltered(conditions)

  return {
    items: specifications,
    meta: {
      total,
      totalFiltered
    }
  }

}

export default {
  create, getAllWithMetadata
}