import { verifyToken } from "../../middlewares/verifyToken.js";
import userModel from "../../models/userModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";

const findOneBy = async ({ payload = {}, projection = {} }) => {
  return await userModel.findOneBy({ payload, projection });
}

const getAccountByGoogleId = async (googleId) => {
  return await userModel.findOneBy({
    payload: { google_id: googleId },
    projection: { _id: 0, created_at: 0, updated_at: 0, deleted_at: 0 }
  })
}

const getInfoAccount = async (req) => {
  const user = req.user
  const account = await userModel.findOne({
    _id: ConvertToObjectId(user.id),
    role: user.role
  }, {
    projection: {
      created_at: 0,
      updated_at: 0,
      deleted_at: 0,
      role: 0,
      google_id: 0,
      _id: 0
    }
  })
  if(!account) throw new ErrorCustom("Tài khoản không tồn tại", 404)
  return account
} 

export default {
  findOneBy, getAccountByGoogleId, getInfoAccount
}