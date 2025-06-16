import orderItemModel from "../../models/orderItemModel.js"
import orderModel from "../../models/orderModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js"
import ErrorCustom from "../../utils/ErrorCustom.js"

const getAll = async () => {
  return await orderModel.getAll()
}

const findOne = async ({ payload = {}, projection = {} }) => {
  return await orderModel.findOne({ payload }, { projection })
}

const getDetail = async (id) => {
  if (!id) throw new ErrorCustom('Bạn chưa truyền id đơn hàng');
  const order = await orderModel.findOne({
    payload: {
      _id: ConvertToObjectId(id)
    }
  })
  if (!order) {
    throw new ErrorCustom('Đơn hàng không tồn tại', 404)
  }
  const orderItems = await orderItemModel.filter({
    filter: {
      order_id: order._id
    }
  })
  return {
    ...order,
    orderItems: orderItems
  }
}
const changeStatus = async (id, data) => {
  if (!id) throw new ErrorCustom('Bạn chưa truyền id đơn hàng');
  if (!data) throw new ErrorCustom('Bạn chưa truyền dữ liệu thay đổi')
    
  return await orderModel.findOneAndUpdate(ConvertToObjectId(id), data);
}
export default {
  getAll, findOne, getDetail, changeStatus
}