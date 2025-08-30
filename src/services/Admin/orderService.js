import orderItemModel from "../../models/orderItemModel.js"
import orderModel, { orderStatus } from "../../models/orderModel.js"
import userModel, { USER_ROLE } from "../../models/userModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js"
import ErrorCustom from "../../utils/ErrorCustom.js"

const getAll = async () => {
  return await orderModel.getAll()
}

const getAllWithMetadata = async (query = {}) => {
  let conditions = [];
  if (query && query.active) {
    switch (query.active) {
      case 1:
        conditions.push(
          { is_active: true }
        )
        break;
      case 0:
        conditions.push(
          { is_active: false }
        )
    }
  }

  if (query.search) {
    conditions.push({
      $or: [
        {
          name: { $regex: query.search.trim(), $options: 'i' }
        },
        {
          email: { $regex: query.search.trim(), $options: 'i' }
        },
        {
          phone_number: { $regex: query.search.trim(), $options: 'i' }
        },
      ]
    })
  }

  conditions = conditions.length > 0 ? { $and: conditions } : {}

  const orders = await orderModel.getAll({ conditions, query });
  const total = await orderModel.countAll()
  const totalFiltered = await orderModel.countFiltered(conditions)
  return {
    items: orders,
    meta: {
      total,
      totalFiltered
    }
  }
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

  const order = await orderModel.findOne({
    payload: {
      _id: ConvertToObjectId(id),
    }
  })

  if (!order) throw new ErrorCustom("Đơn hàng không tồn tại!")
  if (order?.status == orderStatus.CANCELED) throw new ErrorCustom("Đơn hàng này đã bị huỷ")

  let shipper_id = null
  if (!order?.shipper_id && data?.status === orderStatus.SHIPPING) {
    const shipper = await userModel.findOne({
      role: USER_ROLE.shipper,
      'shipper_area.province_code': parseInt(order?.province_code),
      'shipper_area.district_code': parseInt(order?.district_code),
      'shipper_area.ward_code': parseInt(order?.ward_code),
    }, {
      projection: {
        _id: 1
      }
    })
    shipper_id = shipper._id
  }

  return await orderModel.update({
    _id: ConvertToObjectId(id),
    status: !orderStatus.CANCELED
  }, {
    ...data,
    shipper_id
  });

}

const autoAssignOrdersForShipper = async () => {

}
export default {
  getAll, getAllWithMetadata, findOne, getDetail, changeStatus, autoAssignOrdersForShipper
}