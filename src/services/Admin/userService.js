import userModel from "../../models/userModel.js"

const getAll = async (query = {}) => {
  
  let conditions = [];
  if (query && query.active) {
    switch (query.active) {
      case 1:
        conditions.push(
          { is_active: true }
        )
        break;
      case 0:
        conditions.push(
          { is_active: false }
        )
    }
  }
  if (query.search) {
    conditions.push({
      $or: [

        {
          name: { $regex: query.search.trim(), $options: 'i' }
        },
        {
          email: { $regex: query.search.trim(), $options: 'i' }
        },
        {
          phone_number: { $regex: query.search.trim(), $options: 'i' }
        },
        {
          address: { $regex: query.search.trim(), $options: 'i' }
        },
      ]
    })
  }

  conditions = conditions.length > 0 ? { $and: conditions } : {}
  return await userModel.getAll({ conditions, query });
}
const getAllWithMetadata = async (query = {}) => {
  let conditions = [];
  if (query && query.active) {
    switch (query.active) {
      case 1:
        conditions.push(
          { is_active: true }
        )
        break;
      case 0:
        conditions.push(
          { is_active: false }
        )
    }
  }
  if (query.search) {
    conditions.push({
      $or: [

        {
          name: { $regex: query.search.trim(), $options: 'i' }
        },
        {
          email: { $regex: query.search.trim(), $options: 'i' }
        },
        {
          phone_number: { $regex: query.search.trim(), $options: 'i' }
        },
        {
          address: { $regex: query.search.trim(), $options: 'i' }
        },
      ]
    })
  }

  conditions = conditions.length > 0 ? { $and: conditions } : {}
  const users =  await userModel.getAll({ conditions, query });
  const total = await userModel.countAll();
  const totalFiltered = await userModel.countFiltered(conditions)
  
  return {
    items: users,
    meta: {
      total: total,
      totalFiltered: totalFiltered
    }
  }
}

const destroy = async (id) => {
  return await userModel.destroy(id);
}

export default {
  getAll, getAllWithMetadata, destroy
}