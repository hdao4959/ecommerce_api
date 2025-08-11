import userModel, { LOGIN_TYPE, USER_ROLE } from "../../models/userModel.js"
import ErrorCustom from "../../utils/ErrorCustom.js";
import hash from "../../utils/hash.js";

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
    const searchFields = ['name', 'email', 'phone_number', 'address']
    const searchRegex = { $regex: query.search.trim(), $options: 'i' }
    conditions.push({
      $or: searchFields.map(field => (
        {
          [field]: searchRegex
        }
      ))
    })
  }

  conditions = conditions.length > 0 ? { $and: conditions } : {}
  const users = await userModel.getAll({ conditions, query });
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

const create = async (data) => {
  const existEmail = await userModel.findOneBy({
    payload: {
      email: data.email,
      // Bỏ qua các tài khoản có email đăng nhập bằng google
      google_id: null
    }
  })

  if (existEmail) {
    throw new ErrorCustom('Email này đã được sử dụng', 400);
  }

  data.password = await hash.hashPassword(data.password)
  delete data.confirm_password;
  data.login_type = LOGIN_TYPE.email
  data.role = USER_ROLE.client
  return await userModel.create(data)
}

const destroy = async (id) => {
  if (!id) {
    throw new ErrorCustom('Id người dùng không xác định', 400);
  }
  return await userModel.destroy(id);
}

export default {
  getAll, getAllWithMetadata, create, destroy
}