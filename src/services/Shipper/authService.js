import userModel, { LOGIN_TYPE, USER_ROLE } from "../../models/userModel.js"
import ErrorCustom from "../../utils/ErrorCustom.js"
import hash from "../../utils/hash.js"
import tk from "../../utils/token.js"

const login = async (data) => {
  const account = await userModel.findOne({
    email: data.email,
    login_type: LOGIN_TYPE.email,
    role: USER_ROLE.shipper
  })

  if (!account) throw new ErrorCustom('Tài khoản đăng nhập không tồn tại')

  const correctPassword = await hash.checkPassword(data.password, account.password)
  if (!correctPassword) throw new ErrorCustom('Mật khẩu không chính xác')

  const idAccount = account._id.toString()
  const token = tk.createToken({
    id: idAccount,
    role: account.role
  })

  return {
    token,
    account: {
      name: account.name,
      id: idAccount
    }
  }
}
export default {
  login
}