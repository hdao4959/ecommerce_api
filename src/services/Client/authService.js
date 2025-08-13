import { OAuth2Client } from "google-auth-library";
import userModel, { LOGIN_TYPE, USER_ROLE } from "../../models/userModel.js";
import env from "../../config/env.js";
import ErrorCustom from "../../utils/ErrorCustom.js";
import hash from "../../utils/hash.js";
import tk from "../../utils/token.js";

const loginWithGoogle = async (body) => {
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: body.token,
    audience: env.GOOGLE_CLIENT_ID
  })
  const payload = ticket?.getPayload();
  if (!payload) {
    throw new ErrorCustom("Invalid Google token", 400)
  }

  const { name, email, picture, sub } = payload;

  const data = {
    name, email, picture, sub,
    login_type: LOGIN_TYPE.google,
    created_at: body.created_at,
    updated_at: body.created_at,
    deleted_at: body.deleted_at
  }

  const existAccount = await userModel.findOneBy({
    payload: {
      google_id: data.sub
    }
  })
  const newData = {
    ...data,
    google_id: data.sub
  }
  delete newData.sub
  let accountFirstLogin = null
  // Chưa từng đăng nhập bằng google
  if (!existAccount) {
    delete newData.created_at;
    accountFirstLogin = await userModel.create({
      ...newData,
      phone_number: null,
      address: null,
    });
  } else {
    // Đã từng đăng nhập bằng google
    newData.updated_at = Date.now()
    await userModel.update(existAccount._id, newData);
  }

  console.log(existAccount);

  const token = tk.createToken({
    id: accountFirstLogin?.insertedId?.toString() || existAccount._id.toString(),
    role: USER_ROLE.client
  })
  return {
    token,
    account: {
      name,
      picture

    }
  }
}

const register = async (body) => {
  delete body.confirm_password
  const existAccount = await userModel.findOneBy({
    payload: {
      phone_number: body.phone_number,
      login_type: body.login_type
    }
  })
  if (existAccount) throw new ErrorCustom("Số điện thoại này đã được sử dụng")
  const hashedPassword = await hash.hashPassword(body.password)
  body.password = hashedPassword
  const createdAccount = await userModel.create(body)
  const token = tk.createToken({
    id: createdAccount.insertedId,
    role: body.login_type
  })
  const account = {
    name: body.name,
  }

  return {
    token, account
  }
}

const login = async (body) => {

  const existAccount = await userModel.findOne({
    phone_number: body.phone_number,
    login_type: LOGIN_TYPE.phone_number
  })
  console.log(existAccount);


  if (!existAccount) throw new ErrorCustom('Tài khoản không tồn tại trong hệ thống!', 404)

  const matchPassword = await hash.checkPassword(body.password, existAccount.password)
  if (!matchPassword) throw new ErrorCustom('Mật khẩu không chính xác!', 401)

  const token = tk.createToken({
    id: existAccount._id.toString(),
    role: existAccount.role
  })

  return {
    token,
    account: {
      name: existAccount.name,
    }
  }
}

export default {
  loginWithGoogle, register, login
}