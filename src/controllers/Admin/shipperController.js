import shipperService from "../../services/Admin/shipperService.js"
import { successResponse } from "../../utils/response.js";

const getListShipper = async (req, res, next) => {
  try {
    const response = await shipperService.getListShipper(req);
    return successResponse(res, {
      data: {
        ...response
      }
    })
  } catch (error) {
    next(error)
  }
}

const createNewShipper = async (req, res, next) => {
  try {
    await shipperService.createNewShipper(req.body);
    return successResponse(res, {
      message: "Thêm mới Shipper thành công!"
    })
  } catch (error) {
    next(error)
  }
}
export default {
  getListShipper, createNewShipper
}