import userModel, { LOGIN_TYPE, USER_ROLE } from "../../models/userModel.js"
import ErrorCustom from "../../utils/ErrorCustom.js"
import hash from "../../utils/hash.js"

const getListShipper = async (req) => {
  const shippers = await userModel.getAll({
    conditions: {
      role: USER_ROLE.shipper
    }
  })

  const totalFiltered = await userModel.countFiltered({
    role: USER_ROLE.shipper
  })
  return {
    items: shippers,
    meta: {
      totalFiltered
    }
  }
}

const createNewShipper = async (data) => {
  const existEmail = await userModel.countFiltered({
    email: data.email,
    login_type: { $ne: LOGIN_TYPE.google }  
  })
  if (existEmail > 0 ) throw new ErrorCustom('Email đã được sử dụng')
  delete data.confirm_password;
  data.password = await hash.hashPassword(data.password)

  await userModel.create(data)
  return
}
export default {
  getListShipper, createNewShipper
}