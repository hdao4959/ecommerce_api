import orderModel from "../../models/orderModel.js"

const getAll = async () => {
  return await orderModel.getAll()
}

const findOne = async ({ payload = {}, projection = {} }) => {
  return await orderModel.findOne({ payload }, { projection })
}
export default {
  getAll, findOne
}