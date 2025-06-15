import orderItemModel from "../../models/orderItemModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";

const insertMany = async (data) => {
  return await orderItemModel.insertMany(data);
}

const filter = async ({filter = {}, projection = {}}) => {
  if(filter.order_id){
    filter.order_id = ConvertToObjectId(filter.order_id)
  }
  return await orderItemModel.filter({filter}, {projection})
}

export default {
  insertMany, filter
}