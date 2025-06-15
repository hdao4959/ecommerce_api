import orderService from "../../services/Admin/orderService.js";
import orderItemsService from "../../services/Client/orderItemsService.js";
import { successResponse } from "../../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    const orders = await orderService.getAll();
    return successResponse(res, {
      data: {
        orders: orders
      }
    })
  } catch (error) {
    next(error)
  }
}

const detail = async (req, res, next) => {
  try {
    const idParam = req.params.id;

    const order = await orderService.findOne({
      payload: {
        _id: idParam
      }
    })
    const orderItems = await orderItemsService.filter({
      filter: {
        order_id: order._id
      }
    })
    return successResponse(res, {
      data: {
        order: {
          ...order,
          orderItems: orderItems
        }
      }
    })

  } catch (error) {
    next(error)
  }
}

export default {
  getAll, detail
}