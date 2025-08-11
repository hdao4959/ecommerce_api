import { OAuth2Client } from "google-auth-library";
import userModel, { LOGIN_TYPE } from "../models/userModel.js";
import env from "../config/env.js";
import ErrorCustom from "../utils/ErrorCustom.js";

const loginWithGoogle = async (body) => {
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  
  const ticket = await client.verifyIdToken({
    idToken: body.token,
    audience: env.GOOGLE_CLIENT_ID
  })
  const payload = ticket?.getPayload();
  if (!payload) {
    throw new ErrorCustom("Invalid Google token", 400)
    // return errorResponse(res, { message: 'Invalid Google token' }, 400)
  }

  const { name, email, picture, sub } = payload;

  const data = {
    name, email, picture, sub,
    login_type: LOGIN_TYPE.email,
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
  // Đã từng đăng nhập bằng google
  if (!existAccount) {
    delete newData.created_at;
    return await userModel.create({
      ...newData,
      phone_number: null,
      address: null,
    });
  }
  // Chưa từng đăng nhập bằng google
  await userModel.update(existAccount._id, newData);
  return {
          name, email, picture, sub
        }
}

const loginWithEmail = (body) => {

}

export default {
  loginWithGoogle, loginWithEmail
}