import userModel from "../../models/userModel.js"

const getAll = async (query = {}) => {
  const filter = [];

  if (query && query.active) {
    switch (query.active) {
      case 1:
        filter.push(
          { is_active: true }
        )
        break;
      case 0:
        filter.push(
          { is_active: false }
        )
    }
  }
  if (query.search) {
    filter.push({
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

  const finalQuery = filter.length > 0 ? { $and: filter } : {}
  console.log('service', finalQuery);

  return await userModel.getAll({ query: finalQuery });
}

export default {
  getAll
}