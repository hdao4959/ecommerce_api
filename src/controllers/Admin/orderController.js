import orderService from "../../services/Admin/orderService.js";
import { successResponse } from "../../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    const orderWithMeta = await orderService.getAllWithMetadata(req.query);
    return successResponse(res, {
      data: {
        ...orderWithMeta
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
    
    await orderService.changeStatus(params.id, { status: body.status })
    return successResponse(res, { message: "Thay đổi trạng thái đơn hàng thành công!" }, 200)
  } catch (error) {
    next(error)
  }
}
export default {
  getAll, detail, changeStatus
}