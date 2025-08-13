import userModel, { LOGIN_TYPE } from "../../models/userModel.js"
import ErrorCustom from "../../utils/ErrorCustom.js";
import hash from "../../utils/hash.js";
import tk from "../../utils/token.js";

const loginWithEmail = async (data) => {

  if (!data) return
  const existAccount = await userModel.findOne({
    email: data?.email,
    login_type: LOGIN_TYPE.email
  });
  if (!existAccount) throw new ErrorCustom("Tài khoản không tồn tại!", 404)

  const isCorrectPass = await hash.checkPassword(data?.password, existAccount?.password);
  if (existAccount?.role !== "admin") throw new ErrorCustom("Bạn không có quyền truy cập vào hệ thống!", 403)

  if (!isCorrectPass) throw new ErrorCustom("Mật khẩu không chính xác", 409)

  const token = tk.createToken({
    id: existAccount?._id?.toString(),
    role: existAccount?.role
  })

  const account = {
    email: existAccount?.email,
    picture: existAccount?.picture
  }

  return {
    token,
    account
  }
}

export default {
  loginWithEmail
}