import orderModel from "../../models/orderModel.js";

const create = async (data) => {
  return await orderModel.create(data);
}

const findOne = async({payload = {}, projection = {}}) => {
  return await orderModel.findOne({payload}, {projection});
}

const findOneAndUpdate = async (id, data) => {
  return await orderModel.findOneAndUpdate(id, data);
}

export default {
  create, findOne, findOneAndUpdate
}