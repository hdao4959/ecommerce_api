import itemModel from "../../models/orderItemModel.js"

const insertMany = async (data) => {
  return await itemModel.insertMany(data);
}

export default {
  insertMany
}