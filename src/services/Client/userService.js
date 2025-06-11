import userModel from "../../models/userModel.js"

const findOneBy = async ({payload = {}, projection = {}}) => {
  return await userModel.findOneBy({payload, projection});
}

export default {
  findOneBy
}