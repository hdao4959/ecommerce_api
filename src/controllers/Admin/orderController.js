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
    const params = req.params;
    const order = await orderService.getDetail(params.id)
    return successResponse(res, {
      data: {
        'order': order
      }
    })
  } catch (error) {
    next(error)
  }
}

const changeStatus = async (req, res, next) => {
  try {
    const params = req.params
    const body = req.body
    console.log(body.status);
    
    await orderService.changeStatus(params.id, { status: body.status })
    return successResponse(res, { message: "Thay đổi trạng thái đơn hàng thành công!" }, 200)
  } catch (error) {
    next(error)
  }
}
export default {
  getAll, detail, changeStatus
}