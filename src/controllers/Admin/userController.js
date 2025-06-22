import userService from "../../services/Admin/userService.js";
import { successResponse } from "../../utils/response.js";

const getAll = async (req, res, next) => {
  try {
    
    const response = await userService.getAllWithMetadata(req.query);
    return successResponse(res, {
      data: {
        ...response
      }
    })
  } catch (error) {
    next(error)
  }
}

// const destroy = async (req, res, next) => {

// }
export default {
  getAll
}