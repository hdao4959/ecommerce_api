import userModel from "../../models/userModel.js"

const findOneBy = async ({ payload = {}, projection = {} }) => {
  return await userModel.findOneBy({ payload, projection });
}

const getAccountByGoogleId = async (googleId) => {
  return await userModel.findOneBy({
    payload: { google_id: googleId },
    projection: { _id: 0, created_at: 0, updated_at: 0, deleted_at: 0 }
  })
}
export default {
  findOneBy, getAccountByGoogleId
}