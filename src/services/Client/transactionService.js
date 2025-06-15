import transactionModel from "../../models/transactionModel.js"

const create = async (data, options = {}) => {
  return await transactionModel.create(data, options);
}

const findOne = async({payload = {}, projection = {}}) => {
  return await transactionModel.findOne({payload}, {projection});
}
export default {
  create, findOne
}